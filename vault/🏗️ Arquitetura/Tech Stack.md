---
tags:
  - arquitetura
  - frontend
  - backend
  - stack
aliases:
  - Stack
  - Tecnologias
created: 2026-11-05
---

# 🏗️ Tech Stack — TW Network

> Documentação das tecnologias fundamentais que compõem o ecossistema full-stack da loja e backend da rede TW Network.

Voltar para o [[00 - MOC (Map of Content)]].

---

## 💻 Frontend (Client SPA)

| Tecnologia | Versão | Função Principal |
| :--- | :---: | :--- |
| **React** | `19.2.8` | Biblioteca de interface reativa e componetização. |
| **Vite** | `8.3.0` | Bundler e ambiente de desenvolvimento ultrarrápido (HMR). |
| **Tailwind CSS** | `4.3.3` | Framework de estilização utilitária de última geração com `@tailwindcss/vite`. |
| **React Router DOM** | `7.18.4` | Roteamento SPA do lado do cliente com suporte a histórico e URLs amigáveis. |
| **Lucide React** | `1.55.0` | Ícones SVG vetoriais modernos e leves para UI. |
| **Sonner** | `2.0.8` | Biblioteca de notificações Toast responsivas e sonoras. |
| **Framer Motion** | `14.1.0` | Animações fluidas de layout, modais e transições de página. |
| **Canvas Confetti** | `1.9.4` | Efeito visual comemorativo para compras aprovadas. |

---

## ⚙️ Backend (API Server)

| Tecnologia | Versão | Função Principal |
| :--- | :---: | :--- |
| **Node.js** | `>= 20 (v26 LTS)` | Runtime de execução assíncrono em JavaScript/TypeScript. |
| **Express** | `5.3.0` | Framework web robusto com suporte nativo a rotas assíncronas no Express 5. |
| **tsx** | `4.23.15` | Executor nativo TypeScript em ESM sem necessidade de transpile prévio. |
| **pg (node-postgres)** | `8.23.1` | Driver cliente de alta performance para PostgreSQL com pool de conexões. |
| **bcryptjs** | `3.0.3` | Hashing unidirecional com salt para proteção de senhas de jogadores. |
| **jsonwebtoken** | `9.0.3` | Geração e validação de tokens JWT para autenticação stateless. |
| **Helmet** | `8.3.0` | Configuração de cabeçalhos de segurança HTTP e Content Security Policy (CSP). |
| **express-rate-limit** | `8.7.3` | Proteção contra ataques de negação de serviço (DoS) e força bruta. |
| **Mercado Pago SDK** | `3.6.1` | Integração oficial para pagamentos via Pix e Cartão de Crédito. |
| **google-auth-library**| `11.3.2` | Validação de tokens de identidade do Google OAuth 2.0. |

---

## 🔗 Relações & Conexões
* [[Seguranca e Hardening]] — Como esses pacotes foram protegidos contra vulnerabilidades.
* [[Neon PostgreSQL]] — Banco de dados consumido pelo driver `pg`.
* [[Render Web Service]] — Onde o Node.js e o bundle do Vite rodam em produção.
