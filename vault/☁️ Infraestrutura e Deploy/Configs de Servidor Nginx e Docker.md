---
tags:
  - infraestrutura
  - deploy
  - docker
  - nginx
  - pm2
aliases:
  - Docker
  - Nginx
  - PM2
created: 2026-11-05
---

# 🐳 Configurações de Servidor (Nginx, PM2 e Docker) — TW Network

> Arquivos de infraestrutura gerados para permitir o deploy alternativo em VPS Linux dedicadas (Ubuntu/Debian) via PM2 ou Docker Compose.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Render Web Service]].

---

## 🟢 1. Gerenciador de Processos PM2 (`ecosystem.config.cjs`)

Localizado na raiz do projeto, permite rodar o backend com auto-restart e rotação de logs:
* **Comando:** `pm2 start ecosystem.config.cjs --env production`
* **Recursos:**
  - Limite de memória para reinício: `max_memory_restart: '500M'`.
  - Execução via tsx: `node --import tsx server.ts`.
  - Logs gravados em `./logs/pm2-out.log` e `./logs/pm2-err.log` com timestamps.

---

## 🌐 2. VirtualHost Nginx (`twnetwork.conf`)

Template para inclusão em `/etc/nginx/sites-available/twnetwork.conf`:
* **Reverse Proxy:** Encaminha tráfego das portas 80/443 para `http://127.0.0.1:3000`.
* **Cache Imutável:**
  ```nginx
  location ~* ^/(assets|mc-icons)/ {
      expires 1y;
      add_header Cache-Control "public, max-age=31536000, immutable";
      access_log off;
  }
  ```
* **Suporte a WebSockets:** Mapeamento `$http_upgrade` e cabeçalhos de conexão.
* **Segurança:** Bloqueio de arquivos ocultos (`location ~ /\. { deny all; }`) e redirecionamento 301 forçado para HTTPS.

---

## 📦 3. Contêineres Docker e Compose (`Dockerfile` / `docker-compose.yml`)

Permite subir toda a infraestrutura com um único comando:
```bash
docker compose up -d --build
```
* **Dockerfile Multi-Stage:**
  - Estágio 1 (`builder`): Instala pacotes e executa `npm run build`.
  - Estágio 2 (`runner`): Imagem `node:22-alpine` superleve, executando com usuário não-root (`node`) na porta 3000.
* **docker-compose.yml:** Orquestra o serviço `web` e um banco `db` (PostgreSQL 18 com volume persistente `pg_data`).

---

## 🔗 Relações & Conexões
* [[Render Web Service]] — Hospedagem serverless atual.
* [[Seguranca e Hardening]] — Cache e regras de reverse proxy.
* [[Variaveis de Ambiente]] — Injeção de credenciais nos contêineres.
