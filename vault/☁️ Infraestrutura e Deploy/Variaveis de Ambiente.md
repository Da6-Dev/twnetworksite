---
tags:
  - infraestrutura
  - seguranca
  - env
  - configuracao
aliases:
  - .env
  - Variaveis
created: 2026-11-05
---

# 🔐 Variáveis de Ambiente — TW Network

> Catálogo completo das variáveis de ambiente necessárias para a execução do backend, banco de dados e gateways.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Render Web Service]].

---

## 📋 Tabela de Variáveis de Produção

| Variável | Obrigatória? | Exemplo / Descrição | Onde Obter / Configurar |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | **Sim** | `production` | Define o modo de execução como produção. |
| `PORT` | **Sim** | `3000` | Porta onde o Express escuta as conexões HTTP. |
| `DATABASE_URL` | **Sim** | `postgresql://twnetwork_owner:...@ep-...-pooler...neon.tech/twnetwork?sslmode=require` | String de conexão com o banco Neon. |
| `DB_SSL` | **Sim** | `true` | Habilita SSL com rejeição de certificados não autorizados desativada para compatibilidade de nuvem. |
| `JWT_SECRET` | **Sim** | `7f9c2d1e8b4a0f3e6a9d2c...` (64 bytes hex) | Chave secreta de alta entropia para assinar tokens JWT. |
| `ALLOWED_ORIGINS` | Opcional | `https://twnetwork.onrender.com` | Origens autorizadas para consumo da API via CORS. |
| `MERCADOPAGO_ACCESS_TOKEN`| **Sim** | `APP_USR-...` | Token de produção ou teste no painel de desenvolvedores do Mercado Pago. |
| `GOOGLE_CLIENT_ID` | Opcional | `39822465818-...apps.googleusercontent.com` | Client ID configurado no Google Cloud Console para Login Social. |
| `DB_POOL_MAX` | Opcional | `20` (Padrão: 20) | Número máximo de clientes simultâneos no pool do `pg`. |

---

## 🛡️ Regras de Segurança
1. **Nunca versionar `.env` no Git:** O arquivo `.env` está estritamente adicionado no `.gitignore`.
2. **Modelo Público Seguro:** O arquivo `.env.example.production` permanece no repositório como guia de preenchimento sem expor nenhum dado real.
3. **Geração de Segredos Fortes:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

---

## 🔗 Relações & Conexões
* [[Seguranca e Hardening]] — Fail-fast que valida a presença do `JWT_SECRET`.
* [[Neon PostgreSQL]] — Fornecedor da `DATABASE_URL`.
* [[Render Blueprint render.yaml]] — Mapeamento na nuvem.
