import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  className = '',
  layoutId = 'activeTabIndicator',
  mobileLabels = {}
}) {
  return (
    <>
      {/* Desktop: pill/indicator tabs — hidden on mobile via CSS */}
      <div
        role="tablist"
        aria-label="Navegação do perfil"
        className={`perfil-tabs-desktop inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--card-shadow)] min-w-max ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm tracking-normal transition-colors duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--mc-emerald)] ${
                isActive
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-hover)] shadow-sm"
                  transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full font-semibold bg-[var(--mc-emerald)]/15 text-[var(--mc-emerald)] border border-[var(--mc-emerald)]/30">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile: fixed bottom nav — visible only on mobile via CSS */}
      <nav className="perfil-tabs-mobile-nav" role="tablist" aria-label="Navegação do perfil">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const shortLabel = mobileLabels[tab.id] || tab.label;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`perfil-tab-mobile-btn${isActive ? ' ativo' : ''}`}
            >
              {tab.badge && (
                <span className="tab-mobile-badge">{tab.badge}</span>
              )}
              <span className="tab-mobile-icon">{tab.icon}</span>
              <span className="tab-mobile-label">{shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
