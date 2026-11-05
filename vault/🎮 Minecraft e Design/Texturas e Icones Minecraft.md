---
tags:
  - minecraft
  - design
  - texturas
  - frontend
aliases:
  - McIcon
  - Texturas
created: 2026-11-05
---

# 🎮 Texturas e Ícones do Minecraft — TW Network

> Documentação do acervo de 42 texturas oficiais locais do Minecraft e do componente reutilizável `McIcon.jsx`.

Voltar para o [[00 - MOC (Map of Content)]] | Ver [[Design System e Componentes]].

---

## 🎨 O Problema dos Ícones Externos

Anteriormente, o site utilizava uma CDN externa (`ccvaults.com`) que retornava erros HTTP 403 / 404, fazendo com que todos os ícones da loja fossem substituídos por emojis genéricos de controle de videogame (`🎮`).

### A Solução Definitiva:
Baixamos **42 texturas oficiais em PNG** em alta resolução diretamente para o diretório local do projeto:
📁 `public/mc-icons/`

---

## 📦 Acervo de Ícones Locais Disponíveis

1. **Minérios & Riquezas:** `diamond`, `emerald`, `gold_ingot`, `iron_ingot`, `netherite_ingot`, `ancient_debris`, `raw_gold`, `amethyst_shard`.
2. **Armaduras & Ferramentas:** `diamond_sword`, `netherite_sword`, `netherite_chestplate`, `diamond_pickaxe`, `netherite_pickaxe`, `shield`, `bow`, `golden_sword`.
3. **Mágica & Utilidades:** `enchanted_book`, `experience_bottle`, `totem_of_undying`, `golden_apple`, `enchanted_golden_apple`, `beacon`, `nether_star`, `ender_eye`, `ender_pearl`.
4. **Construção & Blocos:** `spawner`, `chest`, `shulker_box`, `obsidian`, `tnt`, `anvil`, `enchanting_table`, `tnt_minecart`.
5. **Cosméticos:** `name_tag`, `lead`, `saddle`, `compass`, `clock`, `firework_rocket`, `dragon_egg`, `elytra`.

---

## 🧩 Componente `McIcon.jsx`

Localizado em `src/components/McIcon.jsx`:
```jsx
export function McIcon({ name, alt, className = "w-6 h-6", size = 24 }) {
  const iconPath = `/mc-icons/${name}.png`;

  return (
    <img
      src={iconPath}
      alt={alt || name}
      className={`pixelated object-contain drop-shadow-sm ${className}`}
      width={size}
      height={size}
      loading="lazy"
      onError={(e) => {
        // Fallback elegante com SVG da picareta caso o nome não exista
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}
```

* **Estilo Pixelated:** A classe `pixelated` (`image-rendering: pixelated`) preserva a nitidez clássica das texturas 16x16 e 32x32 do Minecraft sem borrões indesejados.

---

## 🔗 Relações & Conexões
* [[Design System e Componentes]] — Padrão visual que utiliza esses ícones em cards e banners.
* [[Tech Stack]] — Vite que serve a pasta `public/` estaticamente.
