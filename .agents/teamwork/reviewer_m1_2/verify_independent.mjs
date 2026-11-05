import fs from 'node:fs';

console.log('=== Reviewer 2 Independent Adversarial Verification ===');
let failures = 0;

function check(desc, cond) {
  if (cond) {
    console.log(`[PASS] ${desc}`);
  } else {
    console.error(`[FAIL] ${desc}`);
    failures++;
  }
}

// 1. PM2 ecosystem.config.cjs
try {
  const path = await import('node:path');
  const ecosystemPath = path.resolve(process.cwd(), 'ecosystem.config.cjs');
  const pm2Module = await import('file:///' + ecosystemPath.replace(/\\/g, '/'));
  const pm2 = pm2Module.default || pm2Module;
  const app = pm2.apps ? pm2.apps[0] : null;
  
  check('PM2 export format has apps array', Array.isArray(pm2.apps || (pm2.default && pm2.default.apps)));
  check('PM2 app name is exactly twnetwork-site', app?.name === 'twnetwork-site');
  check('PM2 app script is server.ts', app?.script === 'server.ts');
  check('PM2 app interpreter is node', app?.interpreter === 'node');
  check('PM2 node_args is --import tsx', app?.node_args === '--import tsx');
  check('PM2 memory restart is 500M', app?.max_memory_restart === '500M');
  check('PM2 autorestart is true', app?.autorestart === true);
  check('PM2 time timestamps enabled', app?.time === true);
  check('PM2 error log path explicit', app?.error_file === './logs/pm2-err.log');
  check('PM2 out log path explicit', app?.out_file === './logs/pm2-out.log');
  check('PM2 env has NODE_ENV production and PORT 3000', app?.env?.NODE_ENV === 'production' && app?.env?.PORT === 3000);
  check('PM2 env_production has NODE_ENV production and PORT 3000', app?.env_production?.NODE_ENV === 'production' && app?.env_production?.PORT === 3000);
} catch (err) {
  check('PM2 configuration importable without syntax error: ' + err.message, false);
}

// 2. Nginx twnetwork.conf
try {
  const nginx = fs.readFileSync('twnetwork.conf', 'utf-8');
  check('Nginx map block maps $http_upgrade $connection_upgrade', /map\s+\$http_upgrade\s+\$connection_upgrade\s*\{/.test(nginx));
  check('Nginx listens on port 80', /listen\s+80;/.test(nginx));
  check('Nginx listens on port 443 with ssl http2', /listen\s+443\s+ssl\s+http2;/.test(nginx));
  check('Nginx server_name includes twnetwork.com.br', nginx.includes('server_name twnetwork.com.br www.twnetwork.com.br;'));
  check('Nginx 301 redirect from HTTP to HTTPS', /return\s+301\s+https:\/\/\$host\$request_uri;/.test(nginx));
  check('Nginx ACME challenge override location ^~', /location\s+\^\~\s+\/\.well-known\/acme-challenge\//.test(nginx));
  check('Nginx dotfile deny location ~ /\\.', /location\s+~\s+\/\\\.\s*\{\s*deny\s+all;/.test(nginx));
  check('Nginx proxy_pass points to http://127.0.0.1:3000', nginx.includes('proxy_pass http://127.0.0.1:3000;'));
  check('Nginx Host header', nginx.includes('proxy_set_header Host $host;'));
  check('Nginx X-Real-IP header', nginx.includes('proxy_set_header X-Real-IP $remote_addr;'));
  check('Nginx X-Forwarded-For header', nginx.includes('proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;'));
  check('Nginx X-Forwarded-Proto header', nginx.includes('proxy_set_header X-Forwarded-Proto $scheme;'));
  check('Nginx Upgrade header for WebSocket', nginx.includes('proxy_set_header Upgrade $http_upgrade;'));
  check('Nginx Connection header for WebSocket', nginx.includes('proxy_set_header Connection $connection_upgrade;'));
  check('Nginx /assets/ location with immutable cache', nginx.includes('location /assets/') && nginx.includes('Cache-Control "public, max-age=31536000, immutable"'));
  check('Nginx /mc-icons/ location with immutable cache', nginx.includes('location /mc-icons/') && nginx.includes('Cache-Control "public, max-age=31536000, immutable"'));
  check('Nginx gzip compression enabled', nginx.includes('gzip on;'));

  // Semicolon sanity check (all non-comment, non-block lines end with { } or ;)
  const lines = nginx.split('\n');
  let openBraces = 0;
  let closeBraces = 0;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    for (const ch of line) {
      if (ch === '{') openBraces++;
      if (ch === '}') closeBraces++;
    }
  }
  check(`Nginx balanced braces: open=${openBraces}, close=${closeBraces}`, openBraces === closeBraces && openBraces > 0);
} catch (err) {
  check('Nginx config file accessible: ' + err.message, false);
}

// 3. Dockerfile
try {
  const docker = fs.readFileSync('Dockerfile', 'utf-8');
  check('Dockerfile Stage 1 has node:22-alpine AS builder', /FROM\s+node:22-alpine\s+AS\s+builder/i.test(docker));
  check('Dockerfile Stage 1 runs npm run build', docker.includes('RUN npm run build'));
  check('Dockerfile Stage 2 has node:22-alpine AS runner', /FROM\s+node:22-alpine\s+AS\s+runner/i.test(docker));
  check('Dockerfile Stage 2 installs tsx and prod deps', docker.includes('npm ci --omit=dev && npm install --no-save tsx'));
  check('Dockerfile copies server.ts and db.ts', docker.includes('COPY server.ts ./') && docker.includes('COPY db.ts ./'));
  check('Dockerfile copies dist from builder', docker.includes('COPY --from=builder /app/dist ./dist'));
  check('Dockerfile assigns ownership to node:node', docker.includes('chown -R node:node /app'));
  check('Dockerfile switches to non-root USER node', docker.includes('USER node'));
  check('Dockerfile exposes port 3000', /EXPOSE\s+3000/.test(docker));
  check('Dockerfile CMD starts application', docker.includes('CMD ["npm", "start"]'));
} catch (err) {
  check('Dockerfile accessible: ' + err.message, false);
}

// 4. docker-compose.yml
try {
  const compose = fs.readFileSync('docker-compose.yml', 'utf-8');
  check('docker-compose defines postgres:18', compose.includes('image: postgres:18'));
  check('docker-compose mounts to /var/lib/postgresql', compose.includes('- pg_data:/var/lib/postgresql'));
  check('docker-compose defines DB_SSL: "false"', /DB_SSL:\s*"false"/.test(compose));
  check('docker-compose maps port 3000:3000', compose.includes('"3000:3000"'));
  check('docker-compose declares healthcheck on db', compose.includes('pg_isready'));
  check('docker-compose web depends on db condition: service_healthy', compose.includes('condition: service_healthy'));
  check('docker-compose declares pg_data volume', /volumes:\s*\n\s+pg_data:/.test(compose));
} catch (err) {
  check('docker-compose.yml accessible: ' + err.message, false);
}

// 5. .dockerignore
try {
  const dockerignore = fs.readFileSync('.dockerignore', 'utf-8');
  check('.dockerignore ignores node_modules', dockerignore.includes('node_modules'));
  check('.dockerignore ignores dist', dockerignore.includes('dist'));
  check('.dockerignore ignores .env', dockerignore.includes('.env'));
  check('.dockerignore ignores .git', dockerignore.includes('.git'));
  check('.dockerignore preserves .env.example', dockerignore.includes('!.env.example*'));
} catch (err) {
  check('.dockerignore accessible: ' + err.message, false);
}

// 6. .env.example.production
try {
  const envFile = fs.readFileSync('.env.example.production', 'utf-8');
  const required = [
    'NODE_ENV', 'PORT', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB',
    'DATABASE_URL', 'DB_SSL', 'DB_POOL_MAX', 'JWT_SECRET', 'ALLOWED_ORIGINS',
    'MERCADOPAGO_ACCESS_TOKEN', 'GOOGLE_CLIENT_ID'
  ];
  for (const v of required) {
    check(`.env.example.production defines ${v}`, new RegExp(`^${v}=`, 'm').test(envFile));
  }
  check('.env.example.production contains crypto secret generation guidance', envFile.includes('randomBytes(32).toString(\'hex\')'));
} catch (err) {
  check('.env.example.production accessible: ' + err.message, false);
}

console.log(`\nVerification Finished: ${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
