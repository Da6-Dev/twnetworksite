---
tags:
  - design
  - ui
  - ux
  - componentes
aliases:
  - Design System
  - UI
created: 2026-11-05
---

# 🎨 Design System e Componentes — TW Network

> Padrão visual, paleta de cores, tipografia e diretrizes de experiência de usuário da loja TW Network.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Texturas e Icones Minecraft]].

---

## 🎨 Paleta de Cores do Tema Escuro

* **Fundo Principal (Canvas):** `#090d16` a `#0f172a` (Tons profundos de ardósia/noite estrelada).
* **Superfície de Cards:** `#1e293b` com bordas sutis em `rgba(255, 255, 255, 0.08)` e efeito *Glassmorphism* (`backdrop-blur-md`).
* **Dourado Lendário (Ouro/VIP):** `#fbbf24` a `#f59e0b` (Destaque em botões de compra, títulos VIP e cash).
* **Verde Esmeralda (Sucesso/Economia):** `#10b981` a `#059669` (Preços, cupons aplicados e status aprovado).
* **Vermelho/Rubi Natalino:** `#ef4444` (Crítico para alertas, badges de desconto e tema comemorativo).

---

## 🔤 Tipografia e Elementos Clássicos

* **Fontes:** Fonte sans-serif moderna combinada com elementos em maiúsculas espaçadas (`tracking-wider`, `uppercase`) para dar o ar de servidor gamer medieval/futurista.
* **Badges & Efeitos:**
  - Brilhos pulsantes (*pulse glows*).
  - Sombras projetadas de itens (*drop-shadow-lg*).
  - Transições suaves no hover (`transition-all duration-300 transform hover:-translate-y-1`).

---

## 🔔 Feedback ao Usuário

* **Notificações Toast:** Gerenciadas via `sonner` com suporte a sons temáticos e ícones de status.
* **Celebração:** `canvas-confetti` disparado automaticamente na aprovação de pagamentos.
* **Modais com Framer Motion:** Entradas com scale e fade suaves (`initial={{ opacity: 0, scale: 0.95 }}`).

---

## 🔗 Relações & Conexões
* [[Texturas e Icones Minecraft]] — Ícones integrados em todos os cards de produtos.
* [[Tech Stack]] — Dependências do ecossistema de interface.
