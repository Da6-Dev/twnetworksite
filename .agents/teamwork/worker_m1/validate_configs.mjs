import fs from 'node:fs';

let errors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL: ' + message);
    errors++;
  } else {
    console.log('PASS: ' + message);
  }
}

console.log('=== 1. Validating ecosystem.config.cjs ===');
try {
  const pm2Content = fs.readFileSync('ecosystem.config.cjs', 'utf-8');
  assert(pm2Content.includes('module.exports = {'), 'ecosystem is CommonJS format');
  assert(pm2Content.includes("name: 'twnetwork-site'"), 'app name is twnetwork-site');
  assert(pm2Content.includes("script: 'server.ts'"), 'script is server.ts');
  assert(pm2Content.includes("interpreter: 'node'"), 'interpreter is node');
  assert(pm2Content.includes("node_args: '--import tsx'"), 'node_args includes --import tsx');
  assert(pm2Content.includes("max_memory_restart: '500M'"), 'max_memory_restart is 500M');
  assert(pm2Content.includes('autorestart: true'), 'autorestart is true');
  assert(pm2Content.includes('time: true'), 'time timestamps is true');
  assert(pm2Content.includes("error_file: './logs/pm2-err.log'"), 'error_file set');
  assert(pm2Content.includes("out_file: './logs/pm2-out.log'"), 'out_file set');
  assert(pm2Content.includes('merge_logs: true'), 'merge_logs is true');
  assert(pm2Content.includes("NODE_ENV: 'production'"), 'env has NODE_ENV production');
  assert(pm2Content.includes('PORT: 3000'), 'env has PORT 3000');
} catch (e) {
  assert(false, 'Failed reading ecosystem.config.cjs: ' + e.message);
}

console.log('=== 2. Validating twnetwork.conf ===');
try {
  const nginxContent = fs.readFileSync('twnetwork.conf', 'utf-8');
  assert(nginxContent.includes('map $http_upgrade $connection_upgrade'), 'WebSocket upgrade map declared');
  assert(nginxContent.includes('listen 80;'), 'Server listens on port 80');
  assert(nginxContent.includes('listen 443 ssl http2;'), 'Server listens on port 443 ssl http2');
  assert(nginxContent.includes('server_name twnetwork.com.br www.twnetwork.com.br;'), 'server_name defined');
  assert(nginxContent.includes('return 301 https://$host$request_uri;'), 'HTTP to HTTPS 301 redirect present');
  assert(nginxContent.includes('location ^~ /.well-known/acme-challenge/'), 'ACME challenge block present with ^~');
  assert(nginxContent.includes('location ~ /\\. {'), 'Hidden file deny block present');
  assert(nginxContent.includes('ssl_certificate /etc/letsencrypt/live/twnetwork.com.br/fullchain.pem;'), 'ssl_certificate configured');
  assert(nginxContent.includes('ssl_certificate_key /etc/letsencrypt/live/twnetwork.com.br/privkey.pem;'), 'ssl_certificate_key configured');
  assert(nginxContent.includes('proxy_pass http://127.0.0.1:3000;'), 'proxy_pass points to 127.0.0.1:3000');
  assert(nginxContent.includes('proxy_set_header Host $host;'), 'proxy Host header set');
  assert(nginxContent.includes('proxy_set_header X-Real-IP $remote_addr;'), 'proxy X-Real-IP set');
  assert(nginxContent.includes('proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;'), 'proxy X-Forwarded-For set');
  assert(nginxContent.includes('proxy_set_header X-Forwarded-Proto $scheme;'), 'proxy X-Forwarded-Proto set');
  assert(nginxContent.includes('proxy_set_header Upgrade $http_upgrade;'), 'WebSocket Upgrade header set');
  assert(nginxContent.includes('proxy_set_header Connection $connection_upgrade;'), 'WebSocket Connection header set');
  assert(nginxContent.includes('location /assets/'), 'Static cache for /assets/ defined');
  assert(nginxContent.includes('location /mc-icons/'), 'Static cache for /mc-icons/ defined');
  assert(nginxContent.includes('add_header Cache-Control "public, max-age=31536000, immutable";'), 'Immutable Cache-Control present');
  assert(nginxContent.includes('gzip on;'), 'Gzip compression enabled');
  assert(nginxContent.includes('brotli'), 'Brotli block included');

  // Verify brace matching in nginx config
  let openBraces = (nginxContent.match(/\{/g) || []).length;
  let closeBraces = (nginxContent.match(/\}/g) || []).length;
  assert(openBraces === closeBraces && openBraces > 0, `Nginx braces balanced: ${openBraces} open, ${closeBraces} close`);
} catch (e) {
  assert(false, 'Failed reading twnetwork.conf: ' + e.message);
}

console.log('=== 3. Validating Dockerfile ===');
try {
  const dockerContent = fs.readFileSync('Dockerfile', 'utf-8');
  assert(dockerContent.includes('FROM node:22-alpine AS builder'), 'Builder stage uses node:22-alpine');
  assert(dockerContent.includes('RUN npm run build'), 'Builder executes npm run build');
  assert(dockerContent.includes('FROM node:22-alpine AS runner'), 'Runner stage uses node:22-alpine');
  assert(dockerContent.includes('RUN npm ci --omit=dev && npm install --no-save tsx'), 'Runner installs prod deps and tsx');
  assert(dockerContent.includes('COPY --from=builder /app/dist ./dist'), 'Runner copies dist from builder');
  assert(dockerContent.includes('USER node'), 'Runs as non-root user node');
  assert(dockerContent.includes('EXPOSE 3000'), 'Exposes port 3000');
  assert(dockerContent.includes('CMD ["npm", "start"]'), 'CMD is npm start');
} catch (e) {
  assert(false, 'Failed reading Dockerfile: ' + e.message);
}

console.log('=== 4. Validating docker-compose.yml ===');
try {
  const composeContent = fs.readFileSync('docker-compose.yml', 'utf-8');
  assert(composeContent.includes('services:'), 'Services declared');
  assert(composeContent.includes('db:'), 'Service db declared');
  assert(composeContent.includes('image: postgres:18'), 'db image is postgres:18');
  assert(composeContent.includes('- pg_data:/var/lib/postgresql'), 'pg_data mounted to /var/lib/postgresql');
  assert(composeContent.includes('web:'), 'Service web declared');
  assert(composeContent.includes('ports:') && composeContent.includes('"3000:3000"'), 'web exposes 3000:3000');
  assert(composeContent.includes('DATABASE_URL: postgresql://'), 'DATABASE_URL configured');
  assert(composeContent.includes('DB_SSL: "false"'), 'DB_SSL is false in compose');
  assert(composeContent.includes('condition: service_healthy'), 'web depends on healthy db');
  assert(composeContent.includes('volumes:') && composeContent.includes('pg_data:'), 'pg_data volume declared');

  // Check YAML indentation
  const lines = composeContent.split('\n');
  let oddIndents = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.search(/\S/);
    if (indent % 2 !== 0) {
      oddIndents++;
    }
  }
  assert(oddIndents === 0, `YAML indentation consistent (odd indents: ${oddIndents})`);
} catch (e) {
  assert(false, 'Failed reading docker-compose.yml: ' + e.message);
}

console.log('=== 5. Validating .dockerignore ===');
try {
  const ignoreContent = fs.readFileSync('.dockerignore', 'utf-8');
  assert(ignoreContent.includes('node_modules'), 'ignores node_modules');
  assert(ignoreContent.includes('dist'), 'ignores dist');
  assert(ignoreContent.includes('.env'), 'ignores .env');
  assert(ignoreContent.includes('!.env.example*'), 'preserves .env.example');
  assert(ignoreContent.includes('.git'), 'ignores .git');
  assert(ignoreContent.includes('.agents'), 'ignores .agents');
} catch (e) {
  assert(false, 'Failed reading .dockerignore: ' + e.message);
}

console.log('=== 6. Validating .env.example.production ===');
try {
  const envContent = fs.readFileSync('.env.example.production', 'utf-8');
  const requiredVars = [
    'NODE_ENV', 'PORT', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB',
    'DATABASE_URL', 'DB_SSL', 'DB_POOL_MAX', 'JWT_SECRET', 'ALLOWED_ORIGINS',
    'MERCADOPAGO_ACCESS_TOKEN', 'GOOGLE_CLIENT_ID'
  ];
  for (const v of requiredVars) {
    assert(envContent.includes(v + '='), `documents env var ${v}`);
  }
  assert(envContent.includes("crypto').randomBytes(32).toString('hex')"), 'includes Node.js crypto generation instruction');
  assert(envContent.includes('openssl rand -hex 32'), 'includes openssl generation instruction');
} catch (e) {
  assert(false, 'Failed reading .env.example.production: ' + e.message);
}

if (errors > 0) {
  console.error(`Total verification errors: ${errors}`);
  process.exit(1);
} else {
  console.log('ALL CONFIGURATION CHECKS PASSED PERFECTLY!');
  process.exit(0);
}
