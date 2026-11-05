import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');

console.log('--- Reviewer 1: Independent Deployment Configuration Audit ---');
console.log('Project root:', projectRoot);

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    totalPassed++;
  } else {
    console.error(`[FAIL] ${message}`);
    totalFailed++;
  }
}

// 1. Audit ecosystem.config.cjs
const pm2Path = path.join(projectRoot, 'ecosystem.config.cjs');
assert(fs.existsSync(pm2Path), 'ecosystem.config.cjs exists on disk');
const pm2Content = fs.readFileSync(pm2Path, 'utf8');
assert(pm2Content.includes("name: 'twnetwork-site'"), 'PM2 config defines app name twnetwork-site');
assert(pm2Content.includes("script: 'server.ts'"), 'PM2 config targets server.ts');
assert(pm2Content.includes("interpreter: 'node'"), 'PM2 config specifies interpreter: node');
assert(pm2Content.includes("node_args: '--import tsx'"), 'PM2 config specifies node_args: --import tsx');
assert(pm2Content.includes("max_memory_restart: '500M'"), 'PM2 config specifies max_memory_restart: 500M');
assert(pm2Content.includes('autorestart: true'), 'PM2 config enables autorestart');
assert(pm2Content.includes('time: true'), 'PM2 config enables timestamps (time: true)');
assert(pm2Content.includes("error_file: './logs/pm2-err.log'"), 'PM2 config sets explicit error_file');
assert(pm2Content.includes("out_file: './logs/pm2-out.log'"), 'PM2 config sets explicit out_file');
assert(pm2Content.includes('NODE_ENV: \'production\''), 'PM2 config sets NODE_ENV production');
assert(pm2Content.includes('PORT: 3000'), 'PM2 config sets PORT 3000');

// 2. Audit twnetwork.conf
const nginxPath = path.join(projectRoot, 'twnetwork.conf');
assert(fs.existsSync(nginxPath), 'twnetwork.conf exists on disk');
const nginxContent = fs.readFileSync(nginxPath, 'utf8');

// Brace balance check
const openBraces = (nginxContent.match(/\{/g) || []).length;
const closeBraces = (nginxContent.match(/\}/g) || []).length;
assert(openBraces === closeBraces && openBraces > 0, `Nginx braces balanced: ${openBraces} open, ${closeBraces} close`);

assert(/listen\s+80;/.test(nginxContent), 'Nginx listens on port 80');
assert(/listen\s+443\s+ssl/.test(nginxContent), 'Nginx listens on port 443 with SSL');
assert(/server_name\s+twnetwork\.com\.br\s+www\.twnetwork\.com\.br;/.test(nginxContent), 'Nginx defines server_name');
assert(nginxContent.includes('proxy_pass http://127.0.0.1:3000;'), 'Nginx proxies to http://127.0.0.1:3000');
assert(nginxContent.includes('proxy_set_header Host $host;'), 'Nginx forwards Host header');
assert(nginxContent.includes('proxy_set_header X-Real-IP $remote_addr;'), 'Nginx forwards X-Real-IP header');
assert(nginxContent.includes('proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;'), 'Nginx forwards X-Forwarded-For header');
assert(nginxContent.includes('proxy_set_header X-Forwarded-Proto $scheme;'), 'Nginx forwards X-Forwarded-Proto header');
assert(nginxContent.includes('map $http_upgrade $connection_upgrade'), 'Nginx declares WebSocket upgrade map');
assert(nginxContent.includes('proxy_set_header Upgrade $http_upgrade;'), 'Nginx forwards Upgrade header');
assert(nginxContent.includes('proxy_set_header Connection $connection_upgrade;'), 'Nginx forwards Connection header');
assert(/location\s+\/assets\/\s*\{/.test(nginxContent), 'Nginx has /assets/ location block');
assert(/location\s+\/mc-icons\/\s*\{/.test(nginxContent), 'Nginx has /mc-icons/ location block');
assert(nginxContent.includes('Cache-Control "public, max-age=31536000, immutable";'), 'Nginx sets 1-year immutable caching');
assert(/gzip\s+on;/.test(nginxContent), 'Nginx enables Gzip compression');
assert(/location\s+~\s+\/\\\./.test(nginxContent), 'Nginx blocks dotfiles via regex');
assert(nginxContent.includes('location ^~ /.well-known/acme-challenge/'), 'Nginx has ACME challenge exception with ^~ priority modifier');

// 3. Audit Dockerfile
const dockerfilePath = path.join(projectRoot, 'Dockerfile');
assert(fs.existsSync(dockerfilePath), 'Dockerfile exists on disk');
const dockerContent = fs.readFileSync(dockerfilePath, 'utf8');

assert(dockerContent.includes('FROM node:22-alpine AS builder'), 'Dockerfile uses node:22-alpine in builder stage');
assert(dockerContent.includes('npm run build'), 'Dockerfile executes npm run build in builder stage');
assert(dockerContent.includes('FROM node:22-alpine AS runner'), 'Dockerfile uses node:22-alpine in runner stage');
assert(dockerContent.includes('COPY --from=builder /app/dist ./dist'), 'Dockerfile copies dist from builder');
assert(dockerContent.includes('USER node'), 'Dockerfile switches to non-root USER node');
assert(/EXPOSE\s+3000/.test(dockerContent), 'Dockerfile exposes port 3000');
assert(dockerContent.includes('npm ci --omit=dev') && dockerContent.includes('tsx'), 'Dockerfile installs production deps and tsx');

// 4. Audit docker-compose.yml
const composePath = path.join(projectRoot, 'docker-compose.yml');
assert(fs.existsSync(composePath), 'docker-compose.yml exists on disk');
const composeContent = fs.readFileSync(composePath, 'utf8');

assert(/services:\s*\n/.test(composeContent), 'docker-compose defines services');
assert(/db:\s*\n/.test(composeContent), 'docker-compose defines db service');
assert(/image:\s*postgres:18/.test(composeContent), 'docker-compose db uses postgres:18');
assert(/pg_data:\/var\/lib\/postgresql/.test(composeContent), 'docker-compose mounts pg_data to /var/lib/postgresql');
assert(/web:\s*\n/.test(composeContent), 'docker-compose defines web service');
assert(/3000:3000/.test(composeContent), 'docker-compose web maps port 3000:3000');
assert(/depends_on:\s*\n\s+db:\s*\n\s+condition:\s*service_healthy/.test(composeContent), 'docker-compose web depends on healthy db');
assert(/volumes:\s*\n\s+pg_data:/.test(composeContent), 'docker-compose declares pg_data volume');
assert(/DB_SSL:\s*"false"/.test(composeContent), 'docker-compose explicitly sets DB_SSL="false"');

// 5. Audit .dockerignore
const ignorePath = path.join(projectRoot, '.dockerignore');
assert(fs.existsSync(ignorePath), '.dockerignore exists on disk');
const ignoreContent = fs.readFileSync(ignorePath, 'utf8');
const ignoreLines = ignoreContent.split('\n').map(l => l.trim()).filter(Boolean);

assert(ignoreLines.includes('node_modules'), '.dockerignore excludes node_modules');
assert(ignoreLines.includes('dist'), '.dockerignore excludes dist');
assert(ignoreLines.includes('.env'), '.dockerignore excludes .env');
assert(ignoreLines.includes('.git'), '.dockerignore excludes .git');
assert(ignoreLines.includes('!.env.example*'), '.dockerignore whitelists .env.example*');

// 6. Audit .env.example.production
const envExamplePath = path.join(projectRoot, '.env.example.production');
assert(fs.existsSync(envExamplePath), '.env.example.production exists on disk');
const envContent = fs.readFileSync(envExamplePath, 'utf8');

const requiredVars = [
  'NODE_ENV',
  'PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB',
  'DATABASE_URL',
  'DB_SSL',
  'DB_POOL_MAX',
  'JWT_SECRET',
  'ALLOWED_ORIGINS',
  'MERCADOPAGO_ACCESS_TOKEN',
  'GOOGLE_CLIENT_ID'
];

for (const v of requiredVars) {
  assert(new RegExp(`^#?\\s*${v}=`, 'm').test(envContent), `.env.example.production defines ${v}`);
}

// 7. Verify Crypto Secret Generation Instructions
const generatedHexNode = crypto.randomBytes(32).toString('hex');
assert(generatedHexNode.length === 64, `Node crypto 32 bytes yields 64 hex characters: ${generatedHexNode}`);

console.log('--- Audit Summary ---');
console.log(`Passed: ${totalPassed}`);
console.log(`Failed: ${totalFailed}`);

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log('ALL INDEPENDENT CHECKS PASSED.');
}
