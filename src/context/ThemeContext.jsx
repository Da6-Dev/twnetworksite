import React, { useState, useEffect, useCallback } from 'react';
import { ThemeContext } from './ThemeContextInstance';

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => {
    try {
      const salvo = localStorage.getItem('twnetwork_tema');
      if (salvo === 'light' || salvo === 'dark') return salvo;
      // Preferência padrão: dark (Polar Night)
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  const aplicarTemaNoDom = useCallback((novoTema) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', novoTema);
    if (novoTema === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.style.backgroundColor = 'var(--bg-canvas)';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.style.backgroundColor = 'var(--bg-canvas)';
    }
  }, []);

  useEffect(() => {
    aplicarTemaNoDom(tema);
    try {
      localStorage.setItem('twnetwork_tema', tema);
    } catch {
      // Ignora erro em modo privado estrito
    }
  }, [tema, aplicarTemaNoDom]);

  const alternarTema = () => {
    setTema((anterior) => (anterior === 'dark' ? 'light' : 'dark'));
  };

  const isDark = tema === 'dark';

  return (
    <ThemeContext.Provider value={{ tema, isDark, alternarTema, setTema }}>
      {children}
    </ThemeContext.Provider>
  );
}
