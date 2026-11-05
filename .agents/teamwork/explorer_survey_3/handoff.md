# Relatório de Survey — Deploy & Configurações de Ambiente (R3 e R4)

## 1. Observation

### 1.1 Mapeamento Completo de Variáveis de Ambiente (`process.env`)

A busca textual por `process.env` no repositório revelou as seguintes ocorrências e comportamentos exatos:

1. **`PORT`** (`server.ts:22`)
   - Código: `const PORT = Number(process.env.PORT) || 3000;`
   - Uso: Porta HTTP na qual o Express escuta (`app.listen(PORT, '0.0.0.0')`).
   - Default: `3000`.

2. **`NODE_ENV`** (`server.ts:24`, `db.ts:7`)
   - Código em `server.ts:24`: `const isProduction = process.env.NODE_ENV === 'production';`
   - Código em `db.ts:7`: `const isProduction = process.env.NODE_ENV === 'production';`
   - Efeitos quando `'production'`:
     - `server.ts:26-33`: Lança erro fatal se `JWT_SECRET` não estiver definido ou for a chave insegura de desenvolvimento:
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
     - `server.ts:72`: Ativa CORS restrito para `allowedOrigins` (`origin: isProduction ? allowedOrigins : true`).
     - `server.ts:1301-1306`: Desativa o middleware dinâmico do Vite e passa a servir arquivos estáticos compilados de `dist/`:
       ```ts
       app.use(express.static(path.join(__dirname, 'dist')));
       app.get('{*splat}', (_req, res) => {
         res.sendFile(path.join(__dirname, 'dist', 'index.html'));
       });
       ```
     - `db.ts:11`: Se `DB_SSL` não for explicitamente desativado, ativa conexão SSL com `{ rejectUnauthorized: false }`.

3. **`DATABASE_URL`** (`db.ts:14`)
   - Código: `connectionString: process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/twnetwork?schema=public',`
   - Uso: String de conexão PostgreSQL (URI) utilizada pelo pool de conexões (`pg.Pool`).
   - Default local: `'postgresql://postgres:1234@localhost:5432/twnetwork?schema=public'`.

4. **`DB_SSL`** (`db.ts:8-11`)
   - Código:
     ```ts
     const dbSslEnv = process.env.DB_SSL?.trim().toLowerCase();
     const isSslExplicitlyDisabled = dbSslEnv === 'false' || dbSslEnv === '0';
     const isSslExplicitlyEnabled = dbSslEnv === 'true' || dbSslEnv === '1';
     const useSSL = isSslExplicitlyEnabled || (isProduction && !isSslExplicitlyDisabled);
     ```
   - Efeito crítico: Quando `NODE_ENV=production`, `useSSL` é avaliado como `true` por padrão, a menos que `DB_SSL` seja definido explicitamente como `false` ou `0`. No ambiente do Docker Compose (com container local de PostgreSQL sem TLS configurado internamente), a ausência de `DB_SSL=false` causa erro de conexão imediato!

5. **`DB_POOL_MAX`** (`db.ts:15`)
   - Código: `max: Number(process.env.DB_POOL_MAX) || 20,`
   - Uso: Limite de conexões ativas no pool do PostgreSQL (`pg.Pool`).
   - Default: `20`.

6. **`JWT_SECRET`** (`server.ts:27, 35`)
   - Código: `const JWT_SECRET = process.env.JWT_SECRET?.trim() || DEV_JWT_SECRET;`
   - Valor inseguro proibido em produção: `'twnetwork_jwt_secret_dev_2026_rankup_natal'`.
   - Uso: Assinatura e verificação de tokens JWT (`jwt.sign`, `jwt.verify`) para autenticação de jogadores e staff.
   - Requisito: Segredo de alta entropia (mínimo de 32 bytes/256 bits).

7. **`ALLOWED_ORIGINS`** (`server.ts:65-68`)
   - Código:
     ```ts
     const defaultAllowedOrigins = ['https://twnetwork.com.br', 'https://www.twnetwork.com.br'];
     const parsedAllowedOrigins = process.env.ALLOWED_ORIGINS
       ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, '')).filter(Boolean)
       : [];
     const allowedOrigins = parsedAllowedOrigins.length > 0 ? parsedAllowedOrigins : defaultAllowedOrigins;
     ```
   - Uso: Lista separada por vírgulas de origens autorizadas para CORS.

8. **`MERCADOPAGO_ACCESS_TOKEN`** (`server.ts:42`)
   - Código:
     ```ts
     function getMpClient() {
       dotenv.config();
       const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || '';
       if (!token) return null;
       return new MercadoPagoConfig({ accessToken: token });
     }
     ```
   - Uso: Inicialização do SDK `mercadopago` para geração de PIX, pagamentos por cartão e tickets na loja. Caso ausente, `/api/health` retorna `mercadoPago: false` e criação de pagamentos falha com aviso amigável.

9. **`GOOGLE_CLIENT_ID`** (`server.ts:342, 356`)
   - Código:
     - `app.get('/api/auth/google/client-id', ... res.json({ clientId: process.env.GOOGLE_CLIENT_ID || '' }));`
     - `const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || '';`
   - Uso: Fornecido dinamicamente ao frontend para renderizar o botão Google Identity Services (GSI) e usado pelo backend (`googleOAuthClient.verifyIdToken`) para validar o token criptográfico `credential`.

---

### 1.2 Análise do Build, Execução e Dependências

- `package.json`:
  - `"type": "module"`
  - Scripts:
    - `"dev": "tsx watch server.ts"`
    - `"build": "vite build"`
    - `"start": "tsx server.ts"`
    - `"lint": "oxlint"`
    - `"preview": "vite preview --host 0.0.0.0 --port 3000"`
  - Dependências de execução (`dependencies`):
    `@klashdevelopment/mcicons`, `@prisma/client`, `@types/pg`, `bcryptjs`, `canvas-confetti`, `cors`, `dotenv`, `express`, `express-rate-limit`, `google-auth-library`, `helmet`, `jsonwebtoken`, `mercadopago`, `pg`, `react`, `react-dom`, `sonner`.
  - Dependências de desenvolvimento (`devDependencies`):
    `@tailwindcss/vite`, `@types/canvas-confetti`, `@types/cors`, `@types/express`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `framer-motion`, `lucide-react`, `oxlint`, `react-router-dom`, `tailwindcss`, `tsx`, `vite`.

- Validação dos scripts existentes:
  - `npm run lint` executa `oxlint` com código de saída 0 (11 avisos em arquivos JSX existentes, 0 erros).
  - `npm run build` executa `vite build` com código de saída 0 gerando:
    - `dist/index.html` (1.47 kB)
    - `dist/assets/index-*.css` (138.26 kB)
    - `dist/assets/index-*.js` (786.07 kB)
    - `dist/mc-icons/`
    - `dist/favicon.svg` e `dist/icons.svg`

- Observação sobre o runtime de produção e TypeScript:
  - O entrypoint do servidor é `server.ts` e possui tipagem TypeScript e imports com extensão `.ts` (`import { query } from './db.ts'`).
  - O script `"start"` é `"tsx server.ts"`.
  - O pacote `tsx` está listado em `devDependencies`.
  - Em um container de produção que roda `npm ci --omit=dev`, o comando `tsx` não estará disponível a menos que `tsx` seja instalado na imagem de execução ou que `node_modules` inclua `tsx`.

---

### 1.3 Requisitos e Mudança Arquitetural do PostgreSQL 18

- Documentação oficial da imagem Docker `postgres:18`:
  - A imagem `postgres:18` alterou o diretório padrão de volume e `PGDATA` em relação ao PostgreSQL 17 e anteriores.
  - No PostgreSQL 18:
    - `VOLUME`: `/var/lib/postgresql` (diretório pai).
    - `PGDATA`: `/var/lib/postgresql/18/docker`.
    - Montar volumes no antigo caminho `/var/lib/postgresql/data` causa falha na inicialização do container.
  - Para o `docker-compose.yml`, o volume persistente deve ser montado obrigatoriamente em:
    `- pg_data:/var/lib/postgresql`

---

## 2. Logic Chain

1. **Premissa 1 — Containerização Multi-Stage e Imagem Enxuta (R3):**
   - O estágio de build precisa de todas as dependências (`devDependencies` incluindo Vite, Tailwind e React) para compilar o frontend SPA em `dist/`.
   - O estágio final precisa apenas do runtime Node.js Alpine (`node:22-alpine` ou `node:20-alpine`), das dependências de produção para o Express backend, dos arquivos compilados `dist/`, dos arquivos do servidor `server.ts` e `db.ts`, e do executor TypeScript (`tsx`).
   - Como `node:22-alpine` possui o usuário e grupo padrão `node` (UID 1000, GID 1000), podemos garantir a execução não-root com `USER node` e permissões ajustadas com `chown -R node:node /app`.

2. **Premissa 2 — Execução do `server.ts` no Estágio de Produção:**
   - Em produção, `server.ts` serve tanto a API REST (`/api/*`) quanto os arquivos estáticos de `dist/` para SPA fallback (`{*splat}`).
   - Como `tsx` está em `devDependencies`, executar `npm ci --omit=dev` no estágio final omitiria o `tsx`.
   - Portanto, a estratégia ideal no Dockerfile é executar `npm ci --omit=dev && npm install --no-save tsx` no estágio final, ou copiar `node_modules` com `tsx`. Instalar `tsx` com `--no-save` adiciona ~10MB (apenas o binário esbuild) e garante que `npm start` (`tsx server.ts`) funcione perfeitamente com código limpo e sem dependências desnecessárias de dev (como Vite e oxlint).

3. **Premissa 3 — Orquestração Docker Compose (`web` e `db`):**
   - O serviço `db` utiliza a imagem oficial `postgres:18`, definindo `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (padrão `twnetwork`), e o volume persistente mapeado para `/var/lib/postgresql`.
   - Um healthcheck com `pg_isready` garante que o serviço `web` só inicie quando o PostgreSQL estiver aceitando conexões.
   - O serviço `web` conecta-se a `db:5432` com a variável `DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@db:5432/${POSTGRES_DB:-twnetwork}?schema=public`.
   - Crucialmente, `DB_SSL=false` deve ser explicitamente passado para o serviço `web` no Compose, pois `db.ts:11` força SSL se `NODE_ENV=production` e `DB_SSL` for omitido.

4. **Premissa 4 — `.dockerignore`:**
   - Para manter o contexto de compilação Docker limpo e rápido, deve ignorar `node_modules`, `dist`, `.env`, `.env.*`, `.git`, `.gitignore`, diretórios de agentes e metadados (`.agents`, `.aider-desk`, `.aistudio`), logs e arquivos de sistema (`.DS_Store`, `.vscode`).

5. **Premissa 5 — Template de Variáveis de Ambiente (`.env.example.production`):**
   - Deve cobrir todas as variáveis identificadas em `server.ts` e `db.ts`: `NODE_ENV`, `PORT`, `DATABASE_URL`, `DB_SSL`, `DB_POOL_MAX`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `MERCADOPAGO_ACCESS_TOKEN`, `GOOGLE_CLIENT_ID`.
   - Deve fornecer comandos práticos e seguros para gerar chaves criptográficas (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` e `openssl rand -hex 32`).

---

## 3. Caveats

1. **Inicialização do Schema do Banco de Dados:**
   - O arquivo `server.ts:125-164` executa `inicializarBanco()`, mas ele apenas tenta executar `ALTER TABLE usuarios` e inserir seeds se `COUNT(*)` for zero. Ele **não** possui comandos `CREATE TABLE IF NOT EXISTS` para `usuarios`, `cupons` e `pedidos`.
   - Em um banco de dados novo (como no primeiro `docker compose up`), a tabela `usuarios` não existirá e `server.ts` capturará o erro no bloco `try...catch`, sem criar as tabelas.
   - *Recomendação*: Na implementação do Docker Compose, recomenda-se disponibilizar ou montar um script inicial `init.sql` (ou criar as tabelas) para garantir que containers novos iniciem 100% funcionais.
2. **Ambiente Windows vs. Linux nos Containers:**
   - O projeto está em Windows com caminhos locais, mas o Dockerfile gerará containers Linux (Alpine). Certificar que não haja dependências sensíveis a case (`case-sensitive`) ou caminhos absolutos de Windows nos arquivos.
3. **Chaves Reais em `.env` Atual:**
   - O arquivo `.env` local contém tokens de desenvolvimento/teste (`MERCADOPAGO_ACCESS_TOKEN`, `GOOGLE_CLIENT_ID`, `JWT_SECRET`). O `.env.example.production` deve usar placeholders e orientações estritas para que credenciais reais nunca sejam commitadas.

---

## 4. Conclusion

As especificações detalhadas para a fase de implementação dos requisitos R3 e R4 são as seguintes:

### 4.1 Especificação do `Dockerfile` (Multi-stage)

```dockerfile
# ==============================================================================
# ESTÁGIO 1: BUILD (Compilação do Frontend com Vite)
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copia manifestos de dependência
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies para o build do Vite)
RUN npm ci

# Copia código fonte do projeto
COPY . .

# Compila o frontend React/Vite para a pasta /app/dist
RUN npm run build

# ==============================================================================
# ESTÁGIO 2: PRODUÇÃO (Runtime enxuto e seguro)
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Define ambiente de produção
ENV NODE_ENV=production
ENV PORT=3000

# Copia manifestos de pacotes
COPY package*.json ./

# Instala apenas dependências de produção + tsx runner para executar server.ts
RUN npm ci --omit=dev && npm install --no-save tsx

# Copia os arquivos de backend necessários
COPY server.ts ./
COPY db.ts ./

# Copia o frontend compilado do estágio builder
COPY --from=builder /app/dist ./dist

# Configura permissões e usuário não-root oficial 'node'
RUN chown -R node:node /app
USER node

# Expõe a porta padrão do servidor
EXPOSE 3000

# Inicializa o servidor em produção
CMD ["npm", "start"]
```

### 4.2 Especificação do `docker-compose.yml`

```yaml
services:
  # ----------------------------------------------------------------------------
  # Banco de Dados PostgreSQL 18
  # ----------------------------------------------------------------------------
  db:
    image: postgres:18
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres_secure_pass_2026}
      POSTGRES_DB: ${POSTGRES_DB:-twnetwork}
    volumes:
      # No PostgreSQL 18, o volume é montado no diretório pai /var/lib/postgresql
      - pg_data:/var/lib/postgresql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-twnetwork}"]
      interval: 5s
      timeout: 5s
      retries: 5

  # ----------------------------------------------------------------------------
  # Servidor Web Full-Stack TW Network
  # ----------------------------------------------------------------------------
  web:
    build:
      context: .
      dockerfile: Dockerfile
    restart: always
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres_secure_pass_2026}@db:5432/${POSTGRES_DB:-twnetwork}?schema=public
      DB_SSL: "false"
      DB_POOL_MAX: 20
      JWT_SECRET: ${JWT_SECRET}
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS:-https://twnetwork.com.br,https://www.twnetwork.com.br}
      MERCADOPAGO_ACCESS_TOKEN: ${MERCADOPAGO_ACCESS_TOKEN}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
    depends_on:
      db:
        condition: service_healthy

volumes:
  pg_data:
```

### 4.3 Especificação do `.dockerignore`

```dockerignore
node_modules
dist
dist-ssr
.env
.env.*
!.env.example*
.git
.gitignore
.agents
.aider-desk
.aistudio
logs
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*
.DS_Store
.vscode
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
README.md
bun.lock
```

### 4.4 Especificação do `.env.example.production`

```env
# ==============================================================================
# TW NETWORK - CONFIGURAÇÃO DE AMBIENTE DE PRODUÇÃO (.env)
# ==============================================================================
# Instruções de segurança:
# 1. Copie este arquivo para .env em produção: cp .env.example.production .env
# 2. NUNCA versione o arquivo .env preenchido no repositório Git.
# 3. Gere segredos criptograficamente seguros para JWT_SECRET e POSTGRES_PASSWORD.
#    Comando recomendado via Node.js:
#      node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
#    Ou via OpenSSL:
#      openssl rand -hex 32
# ==============================================================================

# ------------------------------------------------------------------------------
# SERVIDOR & AMBIENTE
# ------------------------------------------------------------------------------
# Define o modo de execução como produção (ativa validações rigorosas e desativa dev tools)
NODE_ENV=production

# Porta interna de escuta da aplicação Node.js (Padrão: 3000)
PORT=3000

# ------------------------------------------------------------------------------
# BANCO DE DADOS (POSTGRESQL 18)
# ------------------------------------------------------------------------------
# Usuário e senha do banco de dados PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=insira_uma_senha_forte_gerada_aleatoriamente
POSTGRES_DB=twnetwork

# String de conexão completa com o PostgreSQL.
# Se rodando via Docker Compose com o serviço 'db':
DATABASE_URL=postgresql://postgres:insira_uma_senha_forte_gerada_aleatoriamente@db:5432/twnetwork?schema=public
# Se rodando direto no host local (fora do Docker):
# DATABASE_URL=postgresql://postgres:insira_uma_senha_forte_gerada_aleatoriamente@localhost:5432/twnetwork?schema=public

# Ativação/Desativação de SSL para conexão com banco.
# Valores aceitos: 'true' (ativa SSL com rejectUnauthorized:false) ou 'false' (sem SSL).
# NOTA CRÍTICA: Em rede interna Docker ou PostgreSQL local sem TLS, defina estritamente DB_SSL=false.
DB_SSL=false

# Limite máximo de clientes simultâneos no pool de conexões (Padrão: 20)
DB_POOL_MAX=20

# ------------------------------------------------------------------------------
# AUTENTICAÇÃO & SEGURANÇA (JWT)
# ------------------------------------------------------------------------------
# Segredo criptográfico de alta entropia para assinatura dos tokens JWT.
# OBRIGATÓRIO: O servidor rejeita a inicialização em produção se não for fornecido
# ou se utilizar o segredo de testes padrão de desenvolvimento.
# Gere com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=gere_uma_chave_aleatoria_com_pelo_menos_64_caracteres_hex

# Origens autorizadas para requisições Cross-Origin (CORS), separadas por vírgula.
# Formato: https://seudominio.com.br,https://www.seudominio.com.br
ALLOWED_ORIGINS=https://twnetwork.com.br,https://www.twnetwork.com.br

# ------------------------------------------------------------------------------
# GATEWAY DE PAGAMENTOS (MERCADO PAGO)
# ------------------------------------------------------------------------------
# Access Token de Produção obtido no painel de desenvolvedor do Mercado Pago.
# Formato esperado: APP_USR-xxxxxxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxx-xxxxxxxxxx
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu_access_token_de_producao_aqui

# ------------------------------------------------------------------------------
# AUTENTICAÇÃO GOOGLE CLOUD (OAUTH 2.0 / GSI)
# ------------------------------------------------------------------------------
# Web Client ID configurado no Google Cloud Console para Google Identity Services.
# Formato esperado: xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_ID=seu_google_client_id.apps.googleusercontent.com
```

---

## 5. Verification Method

Para verificar de forma independente as conclusões desta análise:

1. **Validação de process.env:**
   Executar busca textual no repositório:
   ```powershell
   git grep -n "process.env"
   ```
   Confirmar que todas as 9 variáveis catalogadas (`PORT`, `NODE_ENV`, `DATABASE_URL`, `DB_SSL`, `DB_POOL_MAX`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `MERCADOPAGO_ACCESS_TOKEN`, `GOOGLE_CLIENT_ID`) batem exatamente com as linhas descritas.

2. **Validação do Build e Lint do Projeto:**
   Executar:
   ```powershell
   npm run lint
   npm run build
   ```
   Ambos os comandos devem retornar código de saída 0.

3. **Verificação da Documentação do PostgreSQL 18 no Docker:**
   Consultar a documentação oficial da imagem `postgres:18` referente à diretiva `VOLUME /var/lib/postgresql` e `PGDATA /var/lib/postgresql/18/docker`.

4. **Condições de Invalidação:**
   - Esta análise seria invalidada caso a stack migrasse de `tsx` para um build prévio com `esbuild`/`tsc` gerando JavaScript nativo em `dist/server.js`, eliminando a necessidade de `tsx` no estágio runner.
   - Seria invalidada caso `server.ts` passasse a adotar um ORM como Prisma ou Drizzle com migrações automáticas `prisma migrate deploy` em vez de queries SQL manuais no `pg.Pool`.
