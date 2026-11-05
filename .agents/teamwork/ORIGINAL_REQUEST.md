# Original User Request

## Initial Request — 2026-11-04T01:40:11Z

Gerar os arquivos de configuração de deploy para produção do projeto twnetwork-site (PM2, Nginx, Docker e variáveis de ambiente).

Integrity mode: development

## Requirements

### R1. Configuração do PM2 (`ecosystem.config.cjs`)
Criar o arquivo `ecosystem.config.cjs` para gerenciar a aplicação `twnetwork-site` com PM2 em produção (`NODE_ENV: 'production'`, `PORT: 3000`), inicializando via `npx tsx server.ts` (ou comando equivalente para produção), com auto-restart ativado, limite de reinicialização por consumo de memória em 500M (`max_memory_restart: '500M'`), timestamps nos logs e caminhos explícitos configurados para arquivos de log de erro e de saída.

### R2. Template de Configuração do Nginx (`twnetwork.conf`)
Criar o template de VirtualHost `twnetwork.conf` (para inclusão em `sites-available/` ou `conf.d/`) configurado para escutar nas portas 80 e 443 com placeholders para certificados SSL (Certbot/Let's Encrypt), atuando como proxy reverso para `http://127.0.0.1:3000` com suporte a WebSocket e cabeçalhos de proxy (`Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`). O arquivo deve incluir bloco de cache para `/assets/` e `/mc-icons/` com cabeçalho `Cache-Control: public, max-age=31536000, immutable`, compressão (Gzip/Brotli) para HTML, JS, CSS, JSON, SVG e bloqueio de arquivos ocultos (`location ~ /\. { deny all; }`).

### R3. Contêinerização com Docker e Docker Compose
Criar `Dockerfile` multi-stage: estágio de compilação instalando dependências e rodando `npm run build`, e estágio final de produção enxuto com imagem Node Alpine (`node:22-alpine` ou `node:20-alpine`) rodando como usuário não-root (`node`) e expondo a porta 3000.
Criar `docker-compose.yml` definindo o serviço `web` (com mapeamento de portas, política de restart: always e variáveis de ambiente) e serviço `db` (PostgreSQL 18 com volume persistente para banco de dados).
Criar `.dockerignore` excluindo `node_modules`, `dist`, `.env`, `.git` e outros arquivos sensíveis ou transitórios.

### R4. Template de Variáveis de Ambiente (`.env.example.production`)
Criar o arquivo `.env.example.production` documentado com todas as variáveis requeridas pelo `server.ts` e `db.ts` (`NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `MERCADOPAGO_ACCESS_TOKEN`, `GOOGLE_CLIENT_ID`, etc.), acompanhado de instruções e exemplos para geração de segredos criptograficamente seguros em produção.

### R5. Validação de Sintaxe e Integridade
Validar a sintaxe de todos os arquivos gerados (`ecosystem.config.cjs`, `twnetwork.conf`, `Dockerfile`, `docker-compose.yml`, `.env.example.production`) e verificar que os comandos `npm run lint` e `npm run build` executam com sucesso sem interferências ou regressões.

## Acceptance Criteria

### PM2 (`ecosystem.config.cjs`)
- [ ] O arquivo `ecosystem.config.cjs` existe na raiz do projeto e exporta a configuração com `name: 'twnetwork-site'`, script para iniciar a aplicação em produção, `NODE_ENV: 'production'`, `PORT: 3000'`, `max_memory_restart: '500M'`, timestamps nos logs e caminhos de log definidos.

### Nginx (`twnetwork.conf`)
- [ ] O arquivo `twnetwork.conf` existe e configura blocos de servidor para porta 80 e 443 (com placeholders de certificados SSL), proxy reverso para `http://127.0.0.1:3000`, cabeçalhos (`Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`) e suporte a WebSocket (`Upgrade`, `Connection`).
- [ ] O arquivo `twnetwork.conf` define cache para rotas `/assets/` e `/mc-icons/` com `Cache-Control: public, max-age=31536000, immutable`, ativa compressão para tipos MIME de texto e web, e bloqueia acesso a arquivos iniciados por ponto (`location ~ /\. { deny all; }`).

### Docker e Compose
- [ ] O arquivo `Dockerfile` define multi-stage build, utiliza imagem oficial Node Alpine no estágio final, configura execução como usuário `node` e expõe a porta 3000.
- [ ] O arquivo `docker-compose.yml` declara o serviço `web` (com restart: always, mapeamento de portas e variáveis) e o serviço `db` (PostgreSQL 18 com volume persistente).
- [ ] O arquivo `.dockerignore` existe e ignora `node_modules`, `dist`, `.env` e `.git`.

### Variáveis de Ambiente (`.env.example.production`)
- [ ] O arquivo `.env.example.production` está presente na raiz e documenta todas as variáveis de ambiente necessárias para `server.ts` e `db.ts`, incluindo instruções para geração de segredos seguros.

### Validação e Integridade
- [ ] O comando `npm run lint` conclui com código de saída 0.
- [ ] O comando `npm run build` conclui com código de saída 0.
