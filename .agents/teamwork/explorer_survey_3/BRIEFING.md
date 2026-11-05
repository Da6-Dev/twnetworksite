# BRIEFING — 2026-11-04T01:48:00Z

## Mission
Survey deployment configuration requirements (R3 & R4): Docker, Docker Compose, PostgreSQL 18, .dockerignore, process.env audit, and .env.example.production specification.

## 🔒 My Identity
- Archetype: explorer
- Roles: investigation, survey, synthesis
- Working directory: c:\Users\DaviPsss\OneDrive\Documentos\GitHub\SIte Server Minecraft\twnetworksite\.agents\teamwork\explorer_survey_3\
- Original parent: f26de50a-2071-4055-bf40-1020ddc5d201
- Milestone: Survey Phase - Deployment & Environment Configuration

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Survey process.env usage across the entire codebase
- Investigate Dockerfile, docker-compose.yml, .dockerignore requirements (R3)
- Investigate .env.example.production requirements (R4)
- Produce handoff.md following 5-component protocol

## Current Parent
- Conversation ID: f26de50a-2071-4055-bf40-1020ddc5d201
- Updated: 2026-11-04T01:48:00Z

## Investigation State
- **Explored paths**: `server.ts`, `db.ts`, `package.json`, `vite.config.js`, `.env`, `.env.example`, `.gitignore`, `src/context/`, `src/pages/`, git commit history, PostgreSQL 18 official Docker specifications.
- **Key findings**:
  1. `process.env` inventory complete: `PORT`, `NODE_ENV`, `DATABASE_URL`, `DB_SSL`, `DB_POOL_MAX`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `MERCADOPAGO_ACCESS_TOKEN`, `GOOGLE_CLIENT_ID`.
  2. Critical SSL behavior in `db.ts`: In production, if `DB_SSL` is not explicitly set to `'false'` or `'0'`, `useSSL` defaults to `true`. In Docker Compose, `DB_SSL=false` must be set.
  3. PostgreSQL 18 breaking volume change: Default data volume mount point is `/var/lib/postgresql` (with `PGDATA=/var/lib/postgresql/18/docker`). Mounting `/var/lib/postgresql/data` causes container failure or lost persistence.
  4. Non-root user `node`: Standard `node:22-alpine` has UID/GID 1000 (`node`).
  5. TypeScript runtime (`tsx`): `tsx` is currently in `devDependencies`. The runner container needs `tsx` to execute `server.ts`.
  6. Database initialization: `server.ts` does not create tables (`usuarios`, `cupons`, `pedidos`), only alters/seeds. Initial SQL script is needed for fresh container DB setup.
- **Unexplored areas**: None within the survey scope for deployment and environment.

## Key Decisions Made
- Fully documented all environment variables, exact code citations, and Docker Compose wiring.
- Outlined concrete templates for Dockerfile, docker-compose.yml, .dockerignore, and .env.example.production.

## Artifact Index
- DISPATCH.md — Initial dispatch instructions
- progress.md — Liveness heartbeat and investigation progress
- handoff.md — Final 5-component survey report
