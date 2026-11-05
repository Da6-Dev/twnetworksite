---
tags:
  - infraestrutura
  - deploy
  - render
  - nuvem
aliases:
  - Render
  - Web Service
created: 2026-11-05
---

# ☁️ Render Web Service — TW Network

> Documentação da hospedagem em produção na nuvem Render Cloud Platform.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Variaveis de Ambiente]].

---

## 🌐 Informações Oficiais da Aplicação

* **Service Name:** `twnetwork`
* **Service ID:** `srv-dbmff0ifngtc73f7s710`
* **Dashboard URL:** [dashboard.render.com/web/srv-dbmff0ifngtc73f7s710](https://dashboard.render.com/web/srv-dbmff0ifngtc73f7s710)
* **URL Pública:** [https://twnetwork.onrender.com](https://twnetwork.onrender.com)
* **Healthcheck URL:** [https://twnetwork.onrender.com/api/health](https://twnetwork.onrender.com/api/health)
* **Região:** `Ohio (US East)` *(alinhada com o banco Neon para mínima latência)*
* **Plano:** `Free` ($0/mês)

---

## 🛠️ Comandos de Execução

* **Build Command:**
  ```bash
  npm install --include=dev && npm run build
  ```
  *(Nota crítica: O `--include=dev` é obrigatório para que o Vite e as ferramentas de compilação sejam instaladas mesmo quando `NODE_ENV=production` estiver ativo).*

* **Start Command:**
  ```bash
  npm start
  ```
  *(Equivalente a `tsx server.ts` que escuta em `0.0.0.0:3000`).*

---

## 🩺 Endpoint de Healthcheck (`/api/health`)

O Render testa periodicamente este endpoint para garantir que a aplicação está viva antes de rotear o tráfego:

```typescript
app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    return res.json({
      status: 'ok',
      rede: 'TW Network',
      modo: 'full-stack',
      banco: 'PostgreSQL Conectado',
      mercadoPago: Boolean(getMpClient())
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', mensagem: 'Banco de dados inacessível' });
  }
});
```

---

## ⏰ Prevenção de Modo de Espera (Cold Starts)
No plano gratuito do Render, a instância hiberna após 15 minutos sem requisições. Para contornar isso:
* Configuramos monitoramento no **UptimeRobot** com requisição a cada 5 minutos em `/api/health`.
* Como o Rate Limiter do backend possui isenção para `/api/health`, as consultas do monitor nunca são bloqueadas.

---

## 🔗 Relações & Conexões
* [[Neon PostgreSQL]] — Banco de dados consumido pelo serviço.
* [[Render Blueprint render.yaml]] — Código que gerencia este serviço.
* [[Variaveis de Ambiente]] — Chaves configuradas no painel do Render.
