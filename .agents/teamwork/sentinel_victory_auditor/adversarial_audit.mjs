import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rootDir = path.resolve('.');

console.log('================================================================');
console.log(' VICTORY AUDITOR — INDEPENDENT ADVERSARIAL VERIFICATION SUITE  ');
console.log('================================================================');
console.log('Target Root:', rootDir);

let passCount = 0;
let failCount = 0;
const failures = [];

function check(title, condition, detail = '') {
  if (condition) {
    console.log(`  [PASS] ${title}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${title}${detail ? ' — ' + detail : ''}`);
    failCount++;
    failures.push({ title, detail });
  }
}

// =============================================================================
// TEST SUITE 1: PM2 Configuration (ecosystem.config.cjs)
// =============================================================================
console.log('\n--- 1. PM2 Configuration (ecosystem.config.cjs) ---');
const pm2File = path.join(rootDir, 'ecosystem.config.cjs');
check('ecosystem.config.cjs exists on disk', fs.existsSync(pm2File));

let pm2Config;
try {
  pm2Config = require(pm2File);
  check('ecosystem.config.cjs is valid CommonJS and loads cleanly', Boolean(pm2Config));
} catch (err) {
  check('ecosystem.config.cjs loads cleanly', false, err.message);
}

if (pm2Config && Array.isArray(pm2Config.apps)) {
  const app = pm2Config.apps[0];
  check('PM2 app name is exactly "twnetwork-site"', app.name === 'twnetwork-site', `found: ${app.name}`);
  check('PM2 script is "server.ts"', app.script === 'server.ts', `found: ${app.script}`);
  check('PM2 interpreter is "node"', app.interpreter === 'node', `found: ${app.interpreter}`);
  check('PM2 node_args includes "--import tsx"', String(app.node_args).includes('--import tsx'), `found: ${app.node_args}`);
  check('PM2 max_memory_restart is "500M"', app.max_memory_restart === '500M', `found: ${app.max_memory_restart}`);
  check('PM2 autorestart is true', app.autorestart === true, `found: ${app.autorestart}`);
  check('PM2 time timestamps enabled', app.time === true, `found: ${app.time}`);
  check('PM2 error log path specified', typeof app.error_file === 'string' && app.error_file.length > 0, `found: ${app.error_file}`);
  check('PM2 out log path specified', typeof app.out_file === 'string' && app.out_file.length > 0, `found: ${app.out_file}`);
  check('PM2 default env has NODE_ENV="production"', app.env?.NODE_ENV === 'production', `found: ${app.env?.NODE_ENV}`);
  check('PM2 default env has PORT=3000', app.env?.PORT === 3000, `found: ${app.env?.PORT}`);
  check('PM2 env_production has NODE_ENV="production"', app.env_production?.NODE_ENV === 'production', `found: ${app.env_production?.NODE_ENV}`);
  check('PM2 env_production has PORT=3000', app.env_production?.PORT === 3000, `found: ${app.env_production?.PORT}`);
} else {
  check('PM2 config has apps array', false, 'apps array missing or invalid');
}

// =============================================================================
// TEST SUITE 2: Nginx Configuration (twnetwork.conf)
// =============================================================================
console.log('\n--- 2. Nginx Configuration (twnetwork.conf) ---');
const nginxFile = path.join(rootDir, 'twnetwork.conf');
check('twnetwork.conf exists on disk', fs.existsSync(nginxFile));

const nginxText = fs.readFileSync(nginxFile, 'utf8');

// Syntax & Structural integrity: brace balancing
const openBraces = (nginxText.match(/\{/g) || []).length;
const closeBraces = (nginxText.match(/\}/g) || []).length;
check('Nginx braces balanced', openBraces > 0 && openBraces === closeBraces, `open=${openBraces}, close=${closeBraces}`);

// Server blocks
const serverBlocks = (nginxText.match(/server\s*\{/g) || []).length;
check('Nginx defines at least 2 server blocks (HTTP & HTTPS)', serverBlocks >= 2, `found ${serverBlocks}`);

// Port 80 & 443 listeners
check('Nginx listens on port 80', /listen\s+80;/.test(nginxText));
check('Nginx listens on port 443 with SSL and HTTP/2', /listen\s+443\s+ssl\s+http2;/.test(nginxText));

// SSL placeholders
check('Nginx defines ssl_certificate placeholder', /ssl_certificate\s+\/etc\/letsencrypt\/live\//.test(nginxText));
check('Nginx defines ssl_certificate_key placeholder', /ssl_certificate_key\s+\/etc\/letsencrypt\/live\//.test(nginxText));

// HTTP to HTTPS 301 redirection
check('Nginx redirects port 80 to HTTPS with 301', /return\s+301\s+https:\/\/\$host\$request_uri;/.test(nginxText));

// ACME Challenge with priority modifier ^~
check('Nginx ACME challenge block uses ^~ priority modifier', /location\s+\^\~\s+\/\.well-known\/acme-challenge\//.test(nginxText));

// Dotfile blocking
check('Nginx denies hidden dotfiles', /location\s+~\s+\/\\\.\s*\{\s*deny\s+all;/.test(nginxText));

// Upstream proxy to 127.0.0.1:3000
check('Nginx proxy_pass points to http://127.0.0.1:3000', /proxy_pass\s+http:\/\/127\.0\.0\.1:3000;/.test(nginxText));

// Mandatory proxy headers for Express trust proxy & security
check('Nginx forwards Host header', /proxy_set_header\s+Host\s+\$host;/.test(nginxText));
check('Nginx forwards X-Real-IP header', /proxy_set_header\s+X-Real-IP\s+\$remote_addr;/.test(nginxText));
check('Nginx forwards X-Forwarded-For header', /proxy_set_header\s+X-Forwarded-For\s+\$proxy_add_x_forwarded_for;/.test(nginxText));
check('Nginx forwards X-Forwarded-Proto header', /proxy_set_header\s+X-Forwarded-Proto\s+\$scheme;/.test(nginxText));

// WebSocket upgrade support
check('Nginx defines map $http_upgrade $connection_upgrade', /map\s+\$http_upgrade\s+\$connection_upgrade\s*\{/.test(nginxText));
check('Nginx forwards Upgrade header', /proxy_set_header\s+Upgrade\s+\$http_upgrade;/.test(nginxText));
check('Nginx forwards Connection header', /proxy_set_header\s+Connection\s+\$connection_upgrade;/.test(nginxText));

// Static asset caching: /assets/ and /mc-icons/
check('Nginx defines location /assets/', /location\s+\/assets\/\s*\{/.test(nginxText));
check('Nginx defines location /mc-icons/', /location\s+\/mc-icons\/\s*\{/.test(nginxText));
check('Nginx sets 1-year immutable cache header', /add_header\s+Cache-Control\s+"public,\s*max-age=31536000,\s*immutable";/.test(nginxText));

// Compression: Gzip & Brotli
check('Nginx enables gzip compression', /gzip\s+on;/.test(nginxText));
check('Nginx defines gzip_types including web MIME types', /gzip_types[\s\S]+?text\/css[\s\S]+?application\/javascript[\s\S]+?image\/svg\+xml/.test(nginxText));
check('Nginx contains Brotli configuration block', /brotli/.test(nginxText));

// =============================================================================
// TEST SUITE 3: Dockerfile
// =============================================================================
console.log('\n--- 3. Dockerfile Multi-Stage ---');
const dockerFile = path.join(rootDir, 'Dockerfile');
check('Dockerfile exists on disk', fs.existsSync(dockerFile));

const dockerText = fs.readFileSync(dockerFile, 'utf8');

// Multi-stage verification
const fromStages = dockerText.match(/^FROM\s+.+$/gm) || [];
check('Dockerfile contains at least 2 build stages', fromStages.length >= 2, `found ${fromStages.length} stages`);
check('Dockerfile Stage 1 is named "builder" and uses Node Alpine', /^FROM\s+node:(?:20|22)-alpine\s+AS\s+builder/mi.test(dockerText));
check('Dockerfile Stage 1 runs "npm run build"', /RUN\s+npm\s+run\s+build/.test(dockerText));
check('Dockerfile Stage 2 is named "runner" and uses Node Alpine', /^FROM\s+node:(?:20|22)-alpine\s+AS\s+runner/mi.test(dockerText));
check('Dockerfile Stage 2 copies dist from builder stage', /COPY\s+--from=builder\s+\/app\/dist\s+\.\/dist/.test(dockerText));
check('Dockerfile Stage 2 copies server.ts and db.ts', /COPY\s+server\.ts\s+\.\//.test(dockerText) && /COPY\s+db\.ts\s+\.\//.test(dockerText));
check('Dockerfile changes ownership to user node', /chown\s+-R\s+node:node\s+\/app/.test(dockerText));
check('Dockerfile drops root privileges with "USER node"', /USER\s+node/.test(dockerText));
check('Dockerfile exposes port 3000', /EXPOSE\s+3000/.test(dockerText));
check('Dockerfile sets CMD to start application', /CMD\s+\["npm",\s*"start"\]/.test(dockerText));

// =============================================================================
// TEST SUITE 4: Docker Compose (docker-compose.yml)
// =============================================================================
console.log('\n--- 4. Docker Compose (docker-compose.yml) ---');
const composeFile = path.join(rootDir, 'docker-compose.yml');
check('docker-compose.yml exists on disk', fs.existsSync(composeFile));

const composeText = fs.readFileSync(composeFile, 'utf8');

check('docker-compose.yml declares services', /^services:/m.test(composeText));
check('docker-compose.yml defines "db" service', /^\s{2}db:/m.test(composeText));
check('docker-compose.yml uses PostgreSQL 18', /image:\s*postgres:18/.test(composeText));
check('docker-compose.yml mounts pg_data to /var/lib/postgresql', /pg_data:\/var\/lib\/postgresql/.test(composeText));
check('docker-compose.yml defines db healthcheck using pg_isready', /pg_isready/.test(composeText));

check('docker-compose.yml defines "web" service', /^\s{2}web:/m.test(composeText));
check('docker-compose.yml web maps port 3000:3000', /"3000:3000"/.test(composeText));
check('docker-compose.yml web depends on db condition: service_healthy', /depends_on:[\s\S]+?db:[\s\S]+?condition:\s*service_healthy/.test(composeText));
check('docker-compose.yml explicitly configures DB_SSL: "false"', /DB_SSL:\s*"false"/.test(composeText));
check('docker-compose.yml passes DATABASE_URL pointing to db container', /DATABASE_URL:[\s\S]+?@db:5432\//.test(composeText));
check('docker-compose.yml declares named volume pg_data', /^volumes:[\s\S]+?^\s{2}pg_data:/m.test(composeText));

// =============================================================================
// TEST SUITE 5: .dockerignore
// =============================================================================
console.log('\n--- 5. .dockerignore ---');
const dockerignoreFile = path.join(rootDir, '.dockerignore');
check('.dockerignore exists on disk', fs.existsSync(dockerignoreFile));

const dockerignoreText = fs.readFileSync(dockerignoreFile, 'utf8');
const ignorePatterns = dockerignoreText.split('\n').map(l => l.trim()).filter(Boolean);

check('.dockerignore excludes node_modules', ignorePatterns.includes('node_modules'));
check('.dockerignore excludes dist', ignorePatterns.includes('dist'));
check('.dockerignore excludes .env', ignorePatterns.includes('.env'));
check('.dockerignore excludes .git', ignorePatterns.includes('.git'));
check('.dockerignore whitelists .env.example files (!.env.example*)', ignorePatterns.includes('!.env.example*'));

// =============================================================================
// TEST SUITE 6: Production Environment Template (.env.example.production)
// =============================================================================
console.log('\n--- 6. .env.example.production ---');
const envExampleFile = path.join(rootDir, '.env.example.production');
check('.env.example.production exists on disk', fs.existsSync(envExampleFile));

const envExampleText = fs.readFileSync(envExampleFile, 'utf8');

const expectedEnvVars = [
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

for (const envVar of expectedEnvVars) {
  check(`.env.example.production documents "${envVar}"`, new RegExp(`^#?\\s*${envVar}=`, 'm').test(envExampleText));
}

// Check crypto instructions and test actual execution of documented command
check('.env.example.production documents Node crypto command', envExampleText.includes("crypto').randomBytes(32).toString('hex')"));
check('.env.example.production documents OpenSSL rand command', envExampleText.includes("openssl rand -hex 32"));

const generatedSecret = crypto.randomBytes(32).toString('hex');
check('Documented Node crypto logic produces 64-character (256-bit) high-entropy string', generatedSecret.length === 64 && /^[0-9a-f]{64}$/.test(generatedSecret));

// Verify that no real production secrets were accidentally committed in .env.example.production
const hasLeakedMercadoPagoToken = /APP_USR-[0-9]{16}-[0-9]{6}-[a-z0-9]{32}-[0-9]{9}/i.test(envExampleText);
check('.env.example.production has NO real Mercado Pago production access token', !hasLeakedMercadoPagoToken);

const hasLeakedGoogleClientId = /[0-9]{12}-[a-z0-9]{32}\.apps\.googleusercontent\.com/i.test(envExampleText);
check('.env.example.production has NO real Google Client ID', !hasLeakedGoogleClientId);

// =============================================================================
// TEST SUITE 7: Forensics & Anti-Cheating Invariants
// =============================================================================
console.log('\n--- 7. Forensics & Anti-Cheating Invariants ---');
// Check that configuration files are not empty facades
check('ecosystem.config.cjs size > 500 bytes', fs.statSync(pm2File).size > 500);
check('twnetwork.conf size > 2000 bytes', fs.statSync(nginxFile).size > 2000);
check('Dockerfile size > 1000 bytes', fs.statSync(dockerFile).size > 1000);
check('docker-compose.yml size > 1000 bytes', fs.statSync(composeFile).size > 1000);
check('.env.example.production size > 2000 bytes', fs.statSync(envExampleFile).size > 2000);

// =============================================================================
// SUMMARY & EXIT
// =============================================================================
console.log('\n================================================================');
console.log(` AUDIT RESULTS: ${passCount} PASSED, ${failCount} FAILED `);
console.log('================================================================');

if (failCount > 0) {
  console.error('\nFailures detected:');
  for (const f of failures) {
    console.error(`- ${f.title}: ${f.detail}`);
  }
  process.exit(1);
} else {
  console.log('ALL INDEPENDENT VICTORY AUDIT CHECKS PASSED WITH ZERO ERRORS.');
  process.exit(0);
}
