---
tags:
  - banco-de-dados
  - postgresql
  - neon
  - cloud
aliases:
  - Neon
  - PostgreSQL
created: 2026-11-05
---

# 🗄️ Neon PostgreSQL — TW Network

> Documentação da infraestrutura do banco de dados relacional hospedado na nuvem Serverless do Neon.tech.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Variaveis de Ambiente]].

---

## ☁️ Dados do Cluster no Neon

* **Organização:** `Dav.i (org-fancy-shadow-09831633)`
* **Projeto:** `twnetwork` (ID: `cool-frog-10345994`)
* **Provedor e Região:** AWS US East (Ohio / `us-east-2`)
* **Versão do PostgreSQL:** `PostgreSQL 17.11`
* **Usuário / Role:** `twnetwork_owner`
* **Banco:** `twnetwork`

---

## 🔌 Pool de Conexões e Configuração (`db.ts`)

A conexão com o Neon no backend utiliza o driver oficial `pg` com pool gerenciado:

```typescript
const isProduction = process.env.NODE_ENV === 'production';
const dbSslEnv = process.env.DB_SSL?.trim().toLowerCase();
const isSslExplicitlyDisabled = dbSslEnv === 'false' || dbSslEnv === '0';
const isSslExplicitlyEnabled = dbSslEnv === 'true' || dbSslEnv === '1';
const useSSL = isSslExplicitlyEnabled || (isProduction && !isSslExplicitlyDisabled);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX) || 20, // Máximo de 20 conexões simultâneas
  idleTimeoutMillis: 30000,                   // Fecha conexões ociosas após 30s
  connectionTimeoutMillis: 5000,              // Timeout de conexão em 5s
  ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {})
});

pool.on('error', (err) => {
  console.error('❌ [DB POOL] Erro inesperado em cliente inativo do banco:', err?.message || err);
});
```

---

## ⚡ Conexão Pooled vs Direct

O Neon fornece dois endpoints:
1. **Pooled (Recomendado para Produção):**
   - Host: `ep-misty-voice-bdqo7jw9-pooler.c-8.us-east-2.aws.neon.tech`
   - Utiliza o PgBouncer interno do Neon para suportar milhares de conexões simultâneas sem sobrecarregar a memória do Postgres.
2. **Direct (Sem Pooler):**
   - Host: `ep-misty-voice-bdqo7jw9.c-8.us-east-2.aws.neon.tech`
   - Usado para migrações DDL complexas que exigem conexões diretas de longa duração.

---

## 🔗 Relações & Conexões
* [[Tabela Usuarios]] — Tabela de jogadores e staff.
* [[Tabela Pedidos]] — Tabela de histórico de compras.
* [[Tabela Cupons]] — Tabela de cupons promocionais.
* [[Render Web Service]] — Aplicação Node que consome este banco via `DATABASE_URL`.
