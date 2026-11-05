import React, { useState } from 'react';
import { MCIcons } from '@klashdevelopment/mcicons';
import './McIcon.css';

// Tabela de tamanhos padronizados
const SIZE_MAP = {
  xs: 16,
  sm: 20,
  md: 26,
  lg: 36,
  xl: 48,
  '2xl': 64,
  '3xl': 80
};

// Aliases para nomes comuns e em português
const ALIASES = {
  gold: 'gold_ingot',
  ouro: 'gold_ingot',
  diamond: 'diamond',
  diamante: 'diamond',
  emerald: 'emerald',
  esmeralda: 'emerald',
  netherite: 'netherite_ingot',
  star: 'nether_star',
  pickaxe: 'diamond_pickaxe',
  sword: 'diamond_sword',
  chest: 'chest',
  key: 'tripwire_hook',
  chave: 'tripwire_hook',
  coin: 'gold_nugget',
  moeda: 'gold_nugget',
  totem: 'totem_of_undying',
  apple: 'golden_apple',
  book: 'enchanted_book',
  compass: 'compass',
  bussola: 'compass',
  clock: 'clock',
  relogio: 'clock',
  redstone: 'redstone',
  grass: 'grass_block',
  bloco_grama: 'grass_block'
};

// Catálogo de ícones nativos disponíveis localmente em public/mc-icons/ (offline, 0ms latency)
const LOCAL_ICONS = new Set([
  'amethyst_shard',
  'anvil',
  'barrier',
  'beacon',
  'blaze_rod',
  'bone',
  'book',
  'bow',
  'bread',
  'chest',
  'clock',
  'command_block',
  'compass',
  'copper_ingot',
  'diamond',
  'diamond_helmet',
  'diamond_pickaxe',
  'diamond_sword',
  'emerald',
  'enchanted_book',
  'ender_chest',
  'experience_bottle',
  'fire_charge',
  'gold_ingot',
  'gold_nugget',
  'golden_apple',
  'golden_helmet',
  'golden_pickaxe',
  'grass_block',
  'iron_ingot',
  'iron_sword',
  'jukebox',
  'name_tag',
  'nether_star',
  'netherite_ingot',
  'netherite_sword',
  'paper',
  'potion',
  'redstone',
  'shield',
  'totem_of_undying',
  'tripwire_hook'
]);

// Helper para converter CamelCase / PascalCase em snake_case
function toSnakeCase(str) {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
}

export default function McIcon({
  name,
  category = 'items',
  size = 'md',
  className = '',
  alt,
  title,
  style = {}
}) {
  const [tentouFallback, setTentouFallback] = useState(false);

  if (!name) return null;

  const rawNormalized = toSnakeCase(name);
  const resolvedKey = ALIASES[rawNormalized] || rawNormalized;

  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 26;

  // 1. Prioridade absoluta: carregar do diretório local público /mc-icons/
  let imgSrc = null;
  if (LOCAL_ICONS.has(resolvedKey)) {
    imgSrc = `/mc-icons/${resolvedKey}.png`;
  } else {
    // 2. Busca no catálogo @klashdevelopment/mcicons caso seja um item não empacotado localmente
    const pascalKey = resolvedKey
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('_');

    const iconData =
      MCIcons[category]?.[pascalKey] ||
      MCIcons.items?.[pascalKey] ||
      MCIcons.blocks?.[pascalKey] ||
      MCIcons.icons?.[pascalKey] ||
      MCIcons.gui?.[pascalKey] ||
      null;

    if (iconData) {
      imgSrc = iconData.high_url || iconData.low_url;
    }
  }

  // Fallback caso não encontre nenhuma fonte válida: usa o ícone de baú ou bússola local
  if (!imgSrc) {
    imgSrc = '/mc-icons/chest.png';
  }

  const handleErroCarregamento = () => {
    if (!tentouFallback) {
      setTentouFallback(true);
    }
  };

  const srcFinal = tentouFallback ? '/mc-icons/grass_block.png' : imgSrc;

  return (
    <span
      className={`mc-icon-wrapper ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      title={title || name}
    >
      <img
        src={srcFinal}
        alt={alt || name || 'Minecraft Icon'}
        width={pixelSize}
        height={pixelSize}
        loading="eager"
        className="mc-icon-img"
        onError={handleErroCarregamento}
      />
    </span>
  );
}
