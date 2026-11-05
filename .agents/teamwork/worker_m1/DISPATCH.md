## 2026-11-04T01:50:07Z
You are Worker M1 tasked with creating and validating all production deployment configuration files for project twnetwork-site.

Your working directory is: c:\Users\DaviPsss\OneDrive\Documentos\GitHub\SIte Server Minecraft\twnetworksite\.agents\teamwork\worker_m1\
The authoritative user request is at: c:\Users\DaviPsss\OneDrive\Documentos\GitHub\SIte Server Minecraft\twnetworksite\.agents\teamwork\ORIGINAL_REQUEST.md
The project plan is at: c:\Users\DaviPsss\OneDrive\Documentos\GitHub\SIte Server Minecraft\twnetworksite\.agents\teamwork\orchestrator\PROJECT.md

Read the survey handoff reports first:
- Explorer 1 (PM2 & Runtime): c:\Users\DaviPsss\OneDrive\Documentos\GitHub\SIte Server Minecraft\twnetworksite\.agents\teamwork\explorer_survey_1\handoff.md
- Explorer 2 (Nginx VirtualHost): c:\Users\DaviPsss\OneDrive\Documentos\GitHub\SIte Server Minecraft\twnetworksite\.agents\teamwork\explorer_survey_2\handoff.md
- Explorer 3 (Docker & Env): c:\Users\DaviPsss\OneDrive\Documentos\GitHub\SIte Server Minecraft\twnetworksite\.agents\teamwork\explorer_survey_3\handoff.md

Write Ownership:
You own exclusively the creation of:
1. `ecosystem.config.cjs`
2. `twnetwork.conf`
3. `Dockerfile`
4. `docker-compose.yml`
5. `.dockerignore`
6. `.env.example.production`

DO NOT modify existing source code files (such as server.ts, db.ts, package.json) unless strictly necessary.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Detailed Tasks:
1. R1: Create `ecosystem.config.cjs` in project root:
   - CommonJS format (`module.exports = { apps: [...] }`)
   - `name: 'twnetwork-site'`
   - Production startup command using Node ESM with tsx: `script: 'server.ts'`, `interpreter: 'node'`, `node_args: '--import tsx'` (or compatible script matching `npx tsx server.ts`)
   - `env: { NODE_ENV: 'production', PORT: 3000 }` and `env_production: { NODE_ENV: 'production', PORT: 3000 }`
   - `autorestart: true`
   - `max_memory_restart: '500M'`
   - `time: true` (timestamps on logs)
   - Explicit log paths: `error_file: './logs/pm2-err.log'`, `out_file: './logs/pm2-out.log'`, `merge_logs: true`

2. R2: Create `twnetwork.conf` in project root:
   - WebSocket connection mapping: `map $http_upgrade $connection_upgrade { default upgrade; '' close; }`
   - Server block port 80: HTTP redirect to HTTPS (`return 301 https://$host$request_uri;`), ACME challenge block (`location ^~ /.well-known/acme-challenge/`), hidden file deny (`location ~ /\. { deny all; }`).
   - Server block port 443 with SSL placeholders for Certbot/Let's Encrypt (`ssl_certificate /etc/letsencrypt/live/twnetwork.com.br/fullchain.pem;`, `ssl_certificate_key /etc/letsencrypt/live/twnetwork.com.br/privkey.pem;`), TLS protocols & ciphers.
   - Reverse proxy to `http://127.0.0.1:3000` with proxy headers (`Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`) and WebSocket upgrade headers (`Upgrade`, `Connection`).
   - Static cache blocks for `/assets/` and `/mc-icons/`: `expires 1y; add_header Cache-Control "public, max-age=31536000, immutable";`.
   - Gzip compression with MIME types for HTML, JS, CSS, JSON, SVG, fonts, plus commented Brotli block.
   - Block hidden files (`location ~ /\. { deny all; }`) with ACME exception.

3. R3: Create `Dockerfile`, `docker-compose.yml`, `.dockerignore` in project root:
   - `Dockerfile`: Multi-stage build.
     - Builder: `node:22-alpine`, install all deps (`npm ci`), copy source, run `npm run build`.
     - Runner: `node:22-alpine`, non-root user `node`, expose 3000, install prod deps + `tsx` (`npm ci --omit=dev && npm install --no-save tsx`), copy `server.ts`, `db.ts`, and `dist/` from builder. `CMD ["npm", "start"]`.
   - `docker-compose.yml`:
     - Service `web`: build from current dir, restart always, ports `3000:3000`, env vars (`NODE_ENV=production`, `PORT=3000`, `DATABASE_URL`, `DB_SSL=false`, `DB_POOL_MAX=20`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `MERCADOPAGO_ACCESS_TOKEN`, `GOOGLE_CLIENT_ID`), depends_on `db` healthy.
     - Service `db`: image `postgres:18`, restart always, volume `pg_data:/var/lib/postgresql`, ports `5432:5432`, env (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB=twnetwork`), healthcheck `pg_isready`.
     - Volume `pg_data`.
   - `.dockerignore`: exclude `node_modules`, `dist`, `.env`, `.env.*` (not `.env.example*`), `.git`, `.agents`, logs, etc.

4. R4: Create `.env.example.production` in project root:
   - Exhaustively document all variables: `NODE_ENV`, `PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `DATABASE_URL`, `DB_SSL`, `DB_POOL_MAX`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `MERCADOPAGO_ACCESS_TOKEN`, `GOOGLE_CLIENT_ID`.
   - Include instructions and commands to generate secure secrets (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and `openssl rand -hex 32`).

5. R5: Validation & Testing:
   - Verify syntax of all generated files (`node -c ecosystem.config.cjs`, etc.).
   - Execute `npm run lint` and confirm exit code 0.
   - Execute `npm run build` and confirm exit code 0.

6. Write your comprehensive handoff.md in your working directory:
   `c:\Users\DaviPsss\OneDrive\Documentos\GitHub\SIte Server Minecraft\twnetworksite\.agents\teamwork\worker_m1\handoff.md`
   Send a message to orchestrator when finished.
