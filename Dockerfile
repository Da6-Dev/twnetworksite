# ==============================================================================
# Multi-Stage Dockerfile — TW Network
# Project: twnetwork-site (Full-Stack React + Express + PostgreSQL)
# ==============================================================================

# ------------------------------------------------------------------------------
# ESTÁGIO 1: BUILD (Compilação do Frontend SPA com Vite)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copia manifestos de dependência para cacheamento eficiente de camadas
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies necessárias para o Vite)
RUN npm ci

# Copia todo o código fonte da aplicação
COPY . .

# Compila o frontend React / Vite para o diretório /app/dist
RUN npm run build

# ------------------------------------------------------------------------------
# ESTÁGIO 2: RUNNER (Runtime de Produção Enxuto e Seguro)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Define variáveis de ambiente do runtime de produção
ENV NODE_ENV=production
ENV PORT=3000

# Copia manifestos de pacotes
COPY package*.json ./

# Instala apenas dependências de produção e adiciona o executor tsx
RUN npm ci --omit=dev && npm install --no-save tsx

# Copia arquivos do backend TypeScript
COPY server.ts ./
COPY db.ts ./

# Copia o frontend estático compilado pelo estágio builder
COPY --from=builder /app/dist ./dist

# Configura permissões do sistema de arquivos para o usuário oficial não-root 'node'
RUN chown -R node:node /app

# Alterna para o usuário não-root (UID/GID 1000)
USER node

# Expõe a porta HTTP da aplicação
EXPOSE 3000

# Executa o servidor de produção através do script start (tsx server.ts)
CMD ["npm", "start"]
