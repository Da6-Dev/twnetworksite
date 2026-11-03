import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  className = '',
  layoutId = 'activeTabIndicator'
}) {
  return (
    <div
      role="tablist"
      className={`inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-[var(--card-shadow)] ${className}`}
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
  );
}
