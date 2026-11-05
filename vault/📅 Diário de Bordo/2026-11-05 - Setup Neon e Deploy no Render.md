---
tags:
  - diario
  - changelog
  - deploy
  - neon
  - render
created: 2026-11-05
---

# 📅 2026-11-05 — Setup do Banco Neon e Go-Live no Render

> Registro da criação do banco na nuvem Serverless Neon, execução de DDL inicial e deploy ao vivo no Render.

Voltar para o [[00 - MOC (Map of Content)]].

---

## 🚀 Resumo das Entregas

### 1. Banco de Dados na Nuvem (Neon)
* Conexão na organização `Dav.i (org-fancy-shadow-09831633)`.
* Criação do projeto `twnetwork` (PostgreSQL 17 em AWS Ohio `us-east-2`).
* Execução de script DDL com criação das tabelas [[Tabela Usuarios]], [[Tabela Pedidos]] e [[Tabela Cupons]].
* Semeação das contas staff iniciais (`TeDabliukkkkk` e `Minerador_Pro`) e cupons promocionais.
* Proteção do `.env` no `.gitignore` e remoção do rastreamento do Git.

### 2. Deploy no Render
* Leitura da especificação `render.com/agents.md` e instalação das habilidades oficiais em `.agents/skills/`.
* Criação da Blueprint [[Render Blueprint render.yaml|render.yaml]].
* Conexão via `RENDER_API_KEY` e criação do Web Service `twnetwork` via REST API.
* Resolução do erro 127 de build: ajuste do comando para `npm install --include=dev && npm run build` (permitindo a instalação do Vite e Tailwind com `NODE_ENV=production`).
* Injeção das variáveis de ambiente criptográficas.
* Deploy bem-sucedido com status **LIVE** em [https://twnetwork.onrender.com](https://twnetwork.onrender.com).

### 3. Criação do Obsidian Vault
* Estruturação do cofre de conhecimento em `vault/` com nós bidirecionais e MOC interligado.
* Criação do protocolo de memória no `AGENTS.md`.

---

## 🔗 Notas Relacionadas
* [[Neon PostgreSQL]]
* [[Render Web Service]]
* [[Variaveis de Ambiente]]
* [[00 - MOC (Map of Content)]]
