---
tags:
  - pagamentos
  - pix
  - mercadopago
aliases:
  - Pix
created: 2026-11-05
---

# ⚡ Fluxo Pix — TW Network

> Arquitetura do fluxo de pagamento instantâneo via Pix com confirmação em tempo real e entrega imediata.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Mercado Pago SDK]].

---

## 🔄 Fluxograma do Ciclo de Compra

```mermaid
sequenceDiagram
    autonumber
    actor J as Jogador
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant MP as Mercado Pago API
    participant DB as Neon PostgreSQL

    J->>F: Clica em "Finalizar com Pix"
    F->>B: POST /api/pagamentos/pix (itens, nick, email, cupom)
    B->>MP: Cria pagamento (payment.create)
    MP-->>B: Retorna ID, QR Code e Copia-e-Cola
    B->>DB: Salva em pedidos (status: 'pendente')
    B-->>F: Envia QR Code e código Pix
    F->>J: Exibe tela com QR Code e botão Copiar

    par Polling do Jogador
        loop A cada 4 segundos
            F->>B: GET /api/pedidos/:id/status
            B->>DB: Consulta status
            B-->>F: Retorna status atual
        end
    and Pagamento no Banco
        J->>MP: Paga o Pix pelo App do Banco
        MP->>B: POST /api/pagamentos/webhook
        B->>MP: Consulta status oficial da transação
        B->>DB: Atualiza pedido para 'ENTREGUE'
        B->>DB: Credita Saldo de Cash e Patente VIP
    end

    F->>J: Detecta aprovação -> Toca som de vitória e solta confetes!
```

---

## 📱 Componentes da Interface no Frontend
* **`PixModal.jsx` / `ConclusaoPage.jsx`**: Exibem o tempo restante de expiração do Pix (geralmente 30 minutos), botão de cópia com feedback visual via `sonner`, e animação de confetes via `canvas-confetti` assim que a transação é confirmada.

---

## 🔗 Relações & Conexões
* [[Tabela Pedidos]] — Onde o status da transação transita de `pendente` para `ENTREGUE`.
* [[Tabela Usuarios]] — Jogador que recebe o saldo de Cash e a patente VIP.
* [[Mercado Pago SDK]] — Provedor oficial do gateway Pix.
