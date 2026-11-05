---
tags:
  - banco-de-dados
  - sql
  - usuarios
aliases:
  - Usuarios
  - Jogadores
created: 2026-11-05
---

# 👤 Tabela Usuarios — TW Network

> Estrutura da tabela de contas de jogadores, staff, saldos e patentes VIP no PostgreSQL da TW Network.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Neon PostgreSQL]].

---

## 📐 Esquema DDL

```sql
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nick VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255),
  tipo_conta VARCHAR(50) DEFAULT 'pirata',
  cargo VARCHAR(100) DEFAULT 'Membro',
  patente_vip VARCHAR(100) DEFAULT 'Nenhum',
  saldo_cash NUMERIC(12, 2) DEFAULT 0,
  nick_vinculado BOOLEAN DEFAULT false,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🏷️ Descrição dos Campos

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `INTEGER` | Identificador único serial da conta. |
| `nick` | `VARCHAR(100)` | Nickname do jogador no Minecraft (Único, Case-Insensitive na busca). |
| `email` | `VARCHAR(255)` | E-mail para recuperação e notificações de pagamento (Único). |
| `senha_hash` | `VARCHAR(255)` | Hash criptográfico gerado pelo Bcrypt (nulo em logins puros do Google). |
| `tipo_conta` | `VARCHAR(50)` | Tipo da conta: `'original'` ou `'pirata'`. |
| `cargo` | `VARCHAR(100)` | Cargo no servidor (ex: `'Fundador & Desenvolvedor'`, `'Membro'`). |
| `patente_vip` | `VARCHAR(100)` | Nível VIP atual (ex: `'VIP Deus Supremo'`, `'VIP Titã III'`). |
| `saldo_cash` | `NUMERIC(12, 2)` | Saldo de moedas Cash disponível para gastar na loja do jogo. |
| `nick_vinculado` | `BOOLEAN` | Indica se o nick do Minecraft foi validado pelo usuário. |
| `criado_em` | `TIMESTAMP` | Data e hora de criação da conta. |

---

## 🌱 Contas Iniciais Semeadas (Seed)

| Nick | E-mail | Cargo | Patente VIP | Saldo Cash |
| :--- | :--- | :--- | :--- | :--- |
| `TeDabliukkkkk` | `tedabliu@twnetwork.com.br` | Fundador & Desenvolvedor | VIP Deus Supremo | 150.000 Cash |
| `Minerador_Pro` | `minerador@twnetwork.com.br` | Membro Veterano | VIP Titã III | 45.000 Cash |

---

## 🔗 Relações & Conexões
* [[Tabela Pedidos]] — Relacionamento 1:N (`pedidos.usuario_id -> usuarios.id`).
* [[Autenticacao e Contas]] — Lógica de login e cadastro que manipula esta tabela.
