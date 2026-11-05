---
tags:
  - infraestrutura
  - iac
  - render
  - blueprints
aliases:
  - render.yaml
  - Blueprint
created: 2026-11-05
---

# 📜 Render Blueprint (render.yaml) — TW Network

> Especificação declarativa de Infraestrutura como Código (IaC) para deploy reproduzível e automatizado no Render.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Render Web Service]].

---

## 📄 Conteúdo Oficial do `render.yaml`

O arquivo `render.yaml` está localizado na raiz do projeto:

```yaml
# ==============================================================================
# Render Blueprint Specification — TW Network
# Documentation: https://render.com/docs/blueprint-spec
# ==============================================================================

services:
  - type: web
    name: twnetwork
    runtime: node
    region: ohio
    plan: free
    branch: main
    buildCommand: npm install --include=dev && npm run build
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: DB_SSL
        value: "true"
      - key: DATABASE_URL
        sync: false # Cole a string de conexão do Neon PostgreSQL
      - key: JWT_SECRET
        generateValue: true # O Render gera automaticamente uma chave criptográfica forte
      - key: ALLOWED_ORIGINS
        value: https://twnetwork.onrender.com
      - key: MERCADOPAGO_ACCESS_TOKEN
        sync: false
      - key: GOOGLE_CLIENT_ID
        sync: false
```

---

## 🎯 Vantagens da Blueprint
* **Deploy em 1 Clique:** Qualquer pessoa com acesso ao repositório pode subir o projeto idêntico em segundos.
* **Geração Automática de Chaves (`generateValue: true`):** O Render gera um segredo criptográfico aleatório para o `JWT_SECRET` sem intervenção manual.
* **Sincronização de Variáveis:** O campo `sync: false` protege segredos sensíveis para serem configurados apenas pelo administrador no painel.

---

## 🔗 Relações & Conexões
* [[Render Web Service]] — O serviço instanciado por esta Blueprint.
* [[Variaveis de Ambiente]] — Chaves declaradas na especificação.
