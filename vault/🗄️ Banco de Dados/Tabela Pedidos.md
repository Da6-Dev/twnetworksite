---
tags:
  - banco-de-dados
  - sql
  - pedidos
  - transacoes
aliases:
  - Pedidos
  - Transacoes
created: 2026-11-05
---

# 📦 Tabela Pedidos — TW Network

> Histórico e registro transacional de todas as compras de VIPs, Cash e Caixas realizadas na loja.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Neon PostgreSQL]].

---

## 📐 Esquema DDL

```sql
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  nick VARCHAR(100),
  email VARCHAR(255),
  discord VARCHAR(100),
  metodo VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pendente',
  valor_total NUMERIC(12, 2) NOT NULL,
  mp_payment_id VARCHAR(100),
  pix_copia_cola TEXT,
  pix_qr_code_base64 TEXT,
  itens JSONB,
  pago_em TIMESTAMP,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🏷️ Descrição dos Campos

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `INTEGER` | ID sequencial do pedido no site. |
| `usuario_id` | `INTEGER` | Chave estrangeira ligando ao jogador em [[Tabela Usuarios]]. |
| `nick` | `VARCHAR(100)` | Nickname de destino no Minecraft. |
| `email` | `VARCHAR(255)` | E-mail do pagador para envio do comprovante. |
| `discord` | `VARCHAR(100)` | Usuário de Discord informado no checkout. |
| `metodo` | `VARCHAR(50)` | Método de pagamento (`'pix'`, `'cartao'`). |
| `status` | `VARCHAR(50)` | Status do pedido: `'pendente'`, `'pago'`, `'ENTREGUE'`, `'cancelado'`. |
| `valor_total` | `NUMERIC(12, 2)` | Valor final da compra com descontos de cupom aplicados. |
| `mp_payment_id` | `VARCHAR(100)` | ID oficial da transação registrado no Mercado Pago. |
| `pix_copia_cola` | `TEXT` | Código EMV Copia-e-Cola do Pix. |
| `pix_qr_code_base64` | `TEXT` | Imagem do QR Code em Base64 para escaneamento com celular. |
| `itens` | `JSONB` | Array JSON estruturado contendo os produtos adquiridos, quantidades e valores. |
| `pago_em` | `TIMESTAMP` | Momento exato em que o pagamento foi liquidado. |
| `criado_em` | `TIMESTAMP` | Momento da geração do pedido no carrinho. |

---

## 🔄 Ciclo de Vida do Pedido
1. O jogador finaliza o carrinho ➡️ `status = 'pendente'`.
2. O webhook do Mercado Pago notifica a aprovação ➡️ `status = 'pago'` e preenche `pago_em`.
3. O sistema despacha o cash e ativa o VIP do usuário ➡️ `status = 'ENTREGUE'`.

---

## 🔗 Relações & Conexões
* [[Tabela Usuarios]] — Usuário dono da transação.
* [[Mercado Pago SDK]] — Provedor de pagamento que gera o `mp_payment_id`.
* [[Fluxo Pix]] — Processo de geração e validação do Pix.
