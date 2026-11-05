---
tags:
  - banco-de-dados
  - sql
  - cupons
  - promocoes
aliases:
  - Cupons
  - Descontos
created: 2026-11-05
---

# 🎟️ Tabela Cupons — TW Network

> Estrutura da tabela de cupons promocionais para concessão de descontos percentuais no checkout.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Neon PostgreSQL]].

---

## 📐 Esquema DDL

```sql
CREATE TABLE IF NOT EXISTS cupons (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  desconto_percentual NUMERIC(5, 2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🏷️ Descrição dos Campos

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `INTEGER` | Identificador único serial. |
| `codigo` | `VARCHAR(50)` | Código textual do cupom (Ex: `TWSTUDIOS`, `TEDABLIU`). |
| `desconto_percentual`| `NUMERIC(5, 2)` | Porcentagem de desconto aplicada no total do carrinho. |
| `ativo` | `BOOLEAN` | Define se o cupom está liberado para uso. |
| `criado_em` | `TIMESTAMP` | Data de cadastro do cupom. |

---

## 🏷️ Cupons Ativos Pré-Semeados (Seeds)

| Código | Desconto | Status |
| :--- | :---: | :---: |
| `TWSTUDIOS` | **15% OFF** | Ativo |
| `BEMVINDO` | **10% OFF** | Ativo |
| `TEDABLIU` | **20% OFF** | Ativo |
| `NATAL20` | **20% OFF** | Ativo |
| `TWNETWORK` | **10% OFF** | Ativo |

---

## 🛡️ Segurança na Validação de Cupons
A rota de validação de cupons (`POST /api/cupons/validar`) possui um **Rate Limiter estrito** (máximo de 25 requisições por IP a cada 5 minutos), evitando que invasores usem bots para tentar adivinhar cupons promocionais ocultos por força bruta.

---

## 🔗 Relações & Conexões
* [[Tabela Pedidos]] — Onde o valor com desconto é consolidado.
* [[Seguranca e Hardening]] — Proteção com `cupomLimiter`.
