# Project: twnetwork-site Production Deployment Configuration

## Architecture
- **Full-Stack Application**: Node.js + Express backend serving REST APIs (`/api/*`) and static Vite SPA assets (`dist/`).
- **Runtime Execution**: TypeScript ESM executed via `tsx` or `node --import tsx` on `0.0.0.0:3000`.
- **Database**: PostgreSQL 18 with persistent volume (`pg_data`) and connection pool via `pg.Pool`.
- **Reverse Proxy**: Nginx VirtualHost listening on 80/443, SSL termination placeholders, HTTP->HTTPS redirect, WebSocket upgrade, proxy headers (`Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`), 1-year immutable caching for `/assets/` and `/mc-icons/`, gzip compression, hidden file blocking.
- **Process Manager**: PM2 running `twnetwork-site` with auto-restart, 500M memory limit, log timestamps, and error/out logs.
- **Containerization**: Multi-stage Dockerfile (Vite builder stage + lean Node Alpine runner stage as non-root `node`), Docker Compose with `web` and `db` services, and `.dockerignore`.
- **Environment**: Documented `.env.example.production` covering all required/optional variables with cryptographically secure secret generation instructions.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | PM2 Configuration | `ecosystem.config.cjs` with name `twnetwork-site`, NODE_ENV production, PORT 3000, `max_memory_restart: '500M'`, auto-restart, timestamps, explicit logs | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Nginx VirtualHost | `twnetwork.conf` listening on 80 and 443 with SSL placeholders, reverse proxy to 127.0.0.1:3000, WebSocket support, proxy headers, cache for `/assets/` and `/mc-icons/` (31536000s immutable), compression, dotfile blocking | M1 | ORIGINAL_REQUEST §R2 |
| 3 | Docker & Compose | Multi-stage `Dockerfile` (Node Alpine, user `node`, port 3000), `docker-compose.yml` (`web` service + `db` PostgreSQL 18 with volume `/var/lib/postgresql`), `.dockerignore` | M1 | ORIGINAL_REQUEST §R3 |
| 4 | Environment Template | `.env.example.production` documenting all 9 env vars (`NODE_ENV`, `PORT`, `DATABASE_URL`, `DB_SSL`, `DB_POOL_MAX`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `MERCADOPAGO_ACCESS_TOKEN`, `GOOGLE_CLIENT_ID`), secure secret generation instructions | M1 | ORIGINAL_REQUEST §R4 |
| 5 | Syntax & Integrity Validation | Syntax checks for all 5 generated files, verification that `npm run lint` and `npm run build` finish with exit code 0 | M1 | ORIGINAL_REQUEST §R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Production Deployment Files & Validation | Implement R1 (`ecosystem.config.cjs`), R2 (`twnetwork.conf`), R3 (`Dockerfile`, `docker-compose.yml`, `.dockerignore`), R4 (`.env.example.production`), and R5 (validation) | none | DONE |

### Outputs Produced:
- `ecosystem.config.cjs`: PM2 configuration for `twnetwork-site` with `max_memory_restart: '500M'`, `--import tsx`, explicit logs, and timestamps.
- `twnetwork.conf`: Nginx VirtualHost template on 80/443 with SSL placeholders, WebSocket upgrade, proxy headers, 1-year immutable caching for `/assets/` and `/mc-icons/`, Gzip compression, dotfile denial, and ACME challenge priority override.
- `Dockerfile`: Multi-stage Dockerfile with Node 22 Alpine, unprivileged `node` user, and production tsx execution.
- `docker-compose.yml`: Services `web` and `db` (PostgreSQL 18 with volume `pg_data:/var/lib/postgresql`, `DB_SSL: "false"`).
- `.dockerignore`: Exclusion rules for `node_modules`, `dist`, `.env`, `.git`, etc.
- `.env.example.production`: Complete 12-variable production environment template with Node.js crypto and OpenSSL key generation instructions.
- Verification: `npm run lint` exit code 0, `npm run build` exit code 0, 90/90 empirical audit assertions passed. Gate Result: PASS.

## Interface Contracts
### Express `server.ts` ↔ Nginx `twnetwork.conf`
- Nginx proxies HTTP/WebSocket traffic to `http://127.0.0.1:3000`.
- Nginx forwards client IP via `X-Forwarded-For` and `X-Real-IP` required for Express `app.set('trust proxy', 1)` and rate limiting.
- Static assets `/assets/` and `/mc-icons/` served or proxied with `Cache-Control: public, max-age=31536000, immutable`.

### Docker Compose `web` ↔ `db` (PostgreSQL 18)
- `db` service image `postgres:18`, volume `pg_data:/var/lib/postgresql`.
- `web` service depends on `db` healthcheck (`pg_isready`).
- `web` environment includes `DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres_secure_pass_2026}@db:5432/${POSTGRES_DB:-twnetwork}?schema=public` and `DB_SSL="false"`.

## Code Layout
```
/ (project root)
├── ecosystem.config.cjs       (PM2 production config)
├── twnetwork.conf             (Nginx VirtualHost template)
├── Dockerfile                 (Multi-stage Docker build)
├── docker-compose.yml         (Compose orchestration: web + db)
├── .dockerignore              (Docker build context exclusions)
├── .env.example.production    (Production environment template)
├── server.ts                  (Existing fullstack entry point)
├── db.ts                      (Existing database connection pool)
└── package.json               (Existing dependencies and scripts)
```
