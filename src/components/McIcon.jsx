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

// Aliases para facilitar uso intuitivo com nomes comuns
const ALIASES = {
  gold: 'Gold_Ingot',
  ouro: 'Gold_Ingot',
  diamond: 'Diamond',
  diamante: 'Diamond',
  emerald: 'Emerald',
  esmeralda: 'Emerald',
  netherite: 'Netherite_Ingot',
  star: 'Nether_Star',
  pickaxe: 'Diamond_Pickaxe',
  sword: 'Diamond_Sword',
  chest: 'Chest',
  key: 'Tripwire_Hook',
  chave: 'Tripwire_Hook',
  coin: 'Gold_Nugget',
  moeda: 'Gold_Nugget',
  totem: 'Totem_Of_Undying',
  apple: 'Golden_Apple',
  book: 'Enchanted_Book',
  compass: 'Compass',
  clock: 'Clock',
  redstone: 'Redstone',
  grass: 'Grass_Block'
};

export default function McIcon({
  name,
  category = 'items',
  size = 'md',
  className = '',
  alt,
  title,
  style = {}
}) {
  const [loadError, setLoadError] = useState(false);

  if (!name) return null;

  // Resolve alias ou formata o nome
  const resolvedKey = ALIASES[name.toLowerCase()] || name;

  // Procura no MCIcons pela ordem: categoria especificada -> items -> blocks -> icons -> gui
  const iconData =
    MCIcons[category]?.[resolvedKey] ||
    MCIcons.items?.[resolvedKey] ||
    MCIcons.blocks?.[resolvedKey] ||
    MCIcons.icons?.[resolvedKey] ||
    MCIcons.gui?.[resolvedKey] ||
    null;

  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 26;

  // Fallback caso não encontre no catálogo
  if (!iconData || loadError) {
    return (
      <span
        className={`mc-icon-wrapper ${className}`}
        style={{ width: pixelSize, height: pixelSize, ...style }}
        title={title || resolvedKey}
      >
        <span style={{ fontSize: pixelSize * 0.75, lineHeight: 1 }}>🎮</span>
      </span>
    );
  }

  // Usa high_url com prioridade para máxima nitidez pixel art
  const imgSrc = iconData.high_url || iconData.low_url;

  return (
    <span
      className={`mc-icon-wrapper ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        display: 'inline-flex',
        ...style
      }}
      title={title || iconData.name}
    >
      <img
        src={imgSrc}
        alt={alt || iconData.name || 'Minecraft Icon'}
        width={pixelSize}
        height={pixelSize}
        loading="lazy"
        className="mc-icon-img"
        onError={() => setLoadError(true)}
      />
    </span>
  );
}
