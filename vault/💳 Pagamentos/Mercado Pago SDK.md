---
tags:
  - pagamentos
  - mercadopago
  - checkout
aliases:
  - Mercado Pago
  - MP
created: 2026-11-05
---

# 💳 Mercado Pago SDK — TW Network

> Integração com a API oficial do Mercado Pago para processamento de pagamentos instantâneos (Pix) e cartões de crédito.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Fluxo Pix]].

---

## ⚙️ Inicialização do Cliente (`server.ts`)

O cliente do Mercado Pago é inicializado dinamicamente garantindo que o token mais recente do `.env` seja sempre utilizado:

```typescript
import { MercadoPagoConfig, Payment, Preference, CardToken } from 'mercadopago';

function getMpClient() {
  dotenv.config();
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || '';
  if (!token) return null;
  return new MercadoPagoConfig({ accessToken: token });
}
```

---

## 🚏 Endpoints de Pagamento

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/pagamentos/pix` | Cria a ordem Pix no Mercado Pago e retorna o QR Code em base64 e código copia-e-cola. |
| `POST` | `/api/pagamentos/cartao` | Processa cobrança via cartão com tokenização e parcelamento. |
| `POST` | `/api/pagamentos/webhook` | Recebe a notificação instantânea de liquidação de pagamento enviada pelo Mercado Pago. |
| `GET` | `/api/pedidos/:id/status` | Permite que o frontend faça polling para verificar se o pagamento foi concluído. |

---

## 🔑 Credenciais Utilizadas

* **Variável de Ambiente:** `MERCADOPAGO_ACCESS_TOKEN`
* **Modos Suportados:**
  - Token de Teste (`TEST-...`): Utilizado para simular compras sem débito real.
  - Token de Produção (`APP_USR-...`): Ativo para receber pagamentos reais dos jogadores.

---

## 🔗 Relações & Conexões
* [[Fluxo Pix]] — Passo a passo do processamento de Pix.
* [[Tabela Pedidos]] — Onde o ID da transação (`mp_payment_id`) é vinculado.
* [[Variaveis de Ambiente]] — Chaves e tokens configurados no Render.
