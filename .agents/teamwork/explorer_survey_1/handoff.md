# Survey Report & Handoff — Explorer 1

## 1. Observation

### 1.1 Project Structure & Configuration Files
- **Workspace Root**: `c:\Users\DaviPsss\OneDrive\Documentos\GitHub\SIte Server Minecraft\twnetworksite`
- **`package.json`**:
  - `name`: `"twnetwork-rankup-natal"`
  - `type`: `"module"` (ESM native)
  - `scripts`:
    ```json
    "scripts": {
      "dev": "tsx watch server.ts",
      "build": "vite build",
      "start": "tsx server.ts",
      "lint": "oxlint",
      "preview": "vite preview --host 0.0.0.0 --port 3000"
    }
    ```
  - `dependencies`:
    - `@klashdevelopment/mcicons`: `^1.0.2`
    - `@prisma/client`: `^7.10.1`
    - `@types/pg`: `^8.23.1`
    - `bcryptjs`: `^3.0.3`
    - `canvas-confetti`: `^1.9.4`
    - `cors`: `^2.8.6`
    - `dotenv`: `^18.0.9`
    - `express`: `^5.3.0`
    - `express-rate-limit`: `^8.7.3`
    - `google-auth-library`: `^11.3.2`
    - `helmet`: `^8.3.0`
    - `jsonwebtoken`: `^9.0.3`
    - `mercadopago`: `^3.6.1`
    - `pg`: `^8.23.1`
    - `react`: `^19.2.8`
    - `react-dom`: `^19.2.8`
    - `sonner`: `^2.0.8`
  - `devDependencies`:
    - `@tailwindcss/vite`: `^4.3.3`
    - `@types/canvas-confetti`: `^1.9.0`
    - `@types/cors`: `^2.8.19`
    - `@types/express`: `^5.0.6`
    - `@types/react`: `^19.2.18`
    - `@types/react-dom`: `^19.2.7`
    - `@vitejs/plugin-react`: `^6.1.1`
    - `framer-motion`: `^14.1.0`
    - `lucide-react`: `^1.55.0`
    - `oxlint`: `^1.81.0`
    - `react-router-dom`: `^7.18.4`
    - `tailwindcss`: `^4.3.3`
    - `tsx`: `^4.23.15`
    - `vite`: `^8.3.0`

### 1.2 TypeScript & Build Architecture
- There is **no `tsconfig.json`** in the repository root.
- The project does not compile TypeScript using `tsc`.
- `npm run build` runs `vite build`, which compiles the frontend client into `dist/`:
  - `dist/index.html`
  - `dist/assets/index-[hash].js`
  - `dist/assets/index-[hash].css`
  - Copies static files from `public/`: `favicon.svg`, `icons.svg`, `mc-icons/` (42 icons)
- There is **no server build script** creating `dist/server.js`.
- The server entry point is `server.ts` (directly importing `./db.ts`).
- Server execution is powered by `tsx` (TypeScript Execute / esbuild runtime).

### 1.3 Server Entry Point (`server.ts` & `db.ts`)
- **Port**:
  - `server.ts:22`: `const PORT = Number(process.env.PORT) || 3000;`
  - `server.ts:1308`: `app.listen(PORT, '0.0.0.0', ...)`
- **Environment & Security Guards**:
  - `server.ts:24`: `const isProduction = process.env.NODE_ENV === 'production';`
  - `server.ts:26-33`:
    ```ts
    if (isProduction) {
      const secret = process.env.JWT_SECRET?.trim();
      if (!secret || secret === DEV_JWT_SECRET || secret === 'undefined' || secret === 'null') {
        throw new Error(
          'Configuração inválida para produção: JWT_SECRET não foi definido ou está utilizando a chave padrão insegura de desenvolvimento.'
        );
      }
    }
    ```
  - `server.ts:64-69`:
    - `defaultAllowedOrigins = ['https://twnetwork.com.br', 'https://www.twnetwork.com.br']`
    - Parses `process.env.ALLOWED_ORIGINS` (comma-separated list).
  - `server.ts:1301-1306`:
    ```ts
    } else {
      app.use(express.static(path.join(__dirname, 'dist')));
      app.get('{*splat}', (_req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
      });
    }
    ```
    In production mode, `server.ts` statically serves `dist/` and returns `dist/index.html` for client routing (Express 5 wildcard `{*splat}`).
- **Database Connection (`db.ts`)**:
  - `db.ts:7-19`:
    - Reads `process.env.DATABASE_URL` (default: `'postgresql://postgres:1234@localhost:5432/twnetwork?schema=public'`)
    - Reads `process.env.DB_POOL_MAX` (default: `20`)
    - Reads `process.env.DB_SSL` (`'true'`, `'false'`, etc.)
    - In production, SSL is enabled unless explicitly disabled (`dbSslEnv === 'false' || dbSslEnv === '0'`).
- **Additional Integrations**:
  - `MERCADOPAGO_ACCESS_TOKEN`: Mercado Pago checkout and webhooks (`/api/checkout/pix`, `/api/webhooks/mercadopago`).
  - `GOOGLE_CLIENT_ID`: Google Identity Services OAuth (`/api/auth/google`, `/api/auth/google/client-id`).

### 1.4 Verification of Lint and Build
- Command `npm run lint`:
  - Output: `Found 11 warnings and 0 errors. Finished in 43ms on 44 files with 104 rules using 12 threads.`
  - Exit code: `0`
- Command `npm run build`:
  - Output: `vite v8.3.4 building client environment for production... ✓ 2404 modules transformed. ✓ built in 709ms`
  - Exit code: `0`
- Node runtime check:
  - Node version: `v26.13.0`
  - Execution test: `node --import tsx server.ts` starts server successfully.

### 1.5 File Logging and `.gitignore`
- `.gitignore` (lines 1-8):
  ```gitignore
  # Logs
  logs
  *.log
  ```
  The `logs/` directory and all `*.log` files are already git-ignored.

---

## 2. Logic Chain

1. **Absence of Server Compilation**:
   From Observation 1.1 and 1.2, `package.json` only specifies `"build": "vite build"`. Vite only compiles frontend assets into `dist/`. No `dist/server.js` exists or is configured to be built.

2. **Runtime Execution Mechanism**:
   From Observation 1.2 and 1.4, `server.ts` is executed in TypeScript ESM mode. `tsx` (TypeScript Execute) handles module resolution and transpilation via esbuild at runtime. Running `tsx server.ts` or `node --import tsx server.ts` executes the production server reliably without needing an ahead-of-time build step for Node.

3. **PM2 Ecosystem Design (R1)**:
   - **Name**: Must be `'twnetwork-site'`.
   - **Execution Options in PM2**:
     - *Approach A (Node native with tsx import)*:
       ```javascript
       script: 'server.ts',
       interpreter: 'node',
       node_args: '--import tsx',
       ```
       *Advantage*: PM2 attaches directly to the Node V8 engine process. Memory usage tracking (`max_memory_restart: '500M'`) accurately monitors the real server process instead of an intermediate wrapper process. POSIX process signals (SIGINT/SIGTERM) reach Express cleanly.
     - *Approach B (Direct tsx cli)*:
       ```javascript
       script: 'node_modules/tsx/dist/cli.mjs',
       args: 'server.ts',
       interpreter: 'node',
       ```
     - *Approach C (npx wrapper)*:
       ```javascript
       script: 'npx',
       args: 'tsx server.ts',
       ```
       *Caveat*: `npx` spawns a child process; PM2 monitors the `npx` wrapper PID, which may disguise memory leaks in the child process.
     - *Recommendation*: Configure `script: 'server.ts'`, `interpreter: 'node'`, `node_args: '--import tsx'` as the primary robust engine, while documenting the exact `npx tsx server.ts` alternative.
   - **Environment Variables**:
     - `NODE_ENV: 'production'`
     - `PORT: 3000`
     - Best practice: Define under `env` (default) and `env_production` for parity with `pm2 start ecosystem.config.cjs --env production`.
   - **Restart & Memory Guards**:
     - `autorestart: true`
     - `max_memory_restart: '500M'`
   - **Logging & Timestamps**:
     - `time: true` (or `log_date_format: 'YYYY-MM-DD HH:mm:ss Z'`)
     - `error_file: './logs/pm2-err.log'`
     - `out_file: './logs/pm2-out.log'`
     - `merge_logs: true`

4. **Production Dependency Consideration**:
   - `tsx` is currently listed in `devDependencies`.
   - When deploying with PM2 on a host or inside Docker: if `npm install --omit=dev` is executed, `tsx` would be excluded.
   - For PM2 host deployment, `npm install` (including devDependencies) or `npm install -g tsx` or moving `tsx` to `dependencies` is needed. This must be highlighted for subsequent phases.

5. **Nginx Integration Survey (R2)**:
   - Backend runs on `http://127.0.0.1:3000`.
   - Nginx must proxy to `http://127.0.0.1:3000`.
   - Static assets built by Vite reside in `/assets/` and `/mc-icons/` with immutable caching: `Cache-Control: public, max-age=31536000, immutable`.
   - WebSocket proxying headers required: `Upgrade` and `Connection`.

6. **Environment Variables Template (R4)**:
   - Exhaustive list from codebase grep:
     - `NODE_ENV` (production / development)
     - `PORT` (default: 3000)
     - `DATABASE_URL` (PostgreSQL connection string)
     - `JWT_SECRET` (mandatory production key, must differ from dev default)
     - `ALLOWED_ORIGINS` (comma-separated origins)
     - `MERCADOPAGO_ACCESS_TOKEN` (production MP access token)
     - `GOOGLE_CLIENT_ID` (Google OAuth client ID)
     - `DB_SSL` (true/false)
     - `DB_POOL_MAX` (pool size, default 20)

---

## 3. Caveats

1. **No Ahead-Of-Time Server Build**: `dist/server.js` does not exist. PM2 and Docker must execute `server.ts` via `tsx` or `node --import tsx`.
2. **`tsx` in `devDependencies`**: In containerized or bare-metal production builds, running `npm ci --omit=dev` will omit `tsx` unless `tsx` is either moved to `dependencies` or installed separately.
3. **Database Dependency at Runtime**: While `server.ts` boots and binds port 3000 without database connectivity, API requests will fail if PostgreSQL is down. Production health check is at `/api/health`.
4. **PostgreSQL Version for Docker**: The prompt specifies PostgreSQL 18 in R3. PostgreSQL 18 is not currently an official stable release on Docker Hub (Postgres 17 is latest stable). If `postgres:18` fails to pull in Docker, `postgres:17` or `postgres:17-alpine` is the stable alternative.

---

## 4. Conclusion

The survey confirms:
1. **PM2 Ecosystem Specification (`ecosystem.config.cjs`)**:
   - CommonJS format (`module.exports = { apps: [...] }`).
   - App name: `'twnetwork-site'`.
   - Startup command: `server.ts` with `interpreter: 'node'` and `node_args: '--import tsx'` (or `npx tsx server.ts`).
   - `NODE_ENV: 'production'`, `PORT: 3000`.
   - `autorestart: true`, `max_memory_restart: '500M'`.
   - Explicit logs: `./logs/pm2-err.log`, `./logs/pm2-out.log`, `time: true`.
2. **Current Project Health**:
   - `npm run lint` passes with 0 errors.
   - `npm run build` passes with 0 errors, outputting `dist/`.
   - No build or lint regression observed.
3. The requirements for R1 through R5 are fully mapped and ready for planning and implementation.

---

## 5. Verification Method

To independently verify all survey findings:

1. **Verify Lint & Build**:
   ```bash
   npm run lint
   npm run build
   ```
   Both must return exit code `0`.

2. **Verify Server Entry Point & ESM Execution**:
   ```bash
   node --import tsx -e "import('./server.ts').then(() => { console.log('Import OK'); process.exit(0); }).catch((e) => { console.error(e); process.exit(1); })"
   ```

3. **Verify Gitignore for Logs**:
   Inspect `.gitignore` lines 1-4 to confirm `logs` and `*.log` are ignored.

4. **Invalidation Conditions**:
   - `npm run lint` returns non-zero error code.
   - `npm run build` fails to generate `dist/`.
   - `server.ts` cannot be loaded with `node --import tsx`.
