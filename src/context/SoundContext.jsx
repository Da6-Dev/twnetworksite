import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [somHabilitado, setSomHabilitado] = useState(() => {
    try {
      const salvo = localStorage.getItem('tw_som_habilitado');
      return salvo !== null ? JSON.parse(salvo) : true;
    } catch {
      return true;
    }
  });

  const audioCtxRef = useRef(null);

  // Inicializa o AudioContext sob demanda no primeiro gesto do usuário
  const obterAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  useEffect(() => {
    try {
      localStorage.setItem('tw_som_habilitado', JSON.stringify(somHabilitado));
    } catch {
      // Ignora falhas de storage
    }
  }, [somHabilitado]);

  const alternarSom = () => {
    setSomHabilitado((prev) => {
      const novo = !prev;
      if (novo) {
        // Toca um toque suave de confirmação ao reativar
        tocarSom('clique');
      }
      return novo;
    });
  };

  // 1. Som de Clique Tátil de Minecraft (estilo botão de madeira/pedra)
  const tocarClique = () => {
    if (!somHabilitado) return;
    try {
      const ctx = obterAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Falha silenciosa de áudio
    }
  };

  // 2. Som de Orbe de Experiência (XP Pick) — Clássico Ding Ascendente
  const tocarXP = () => {
    if (!somHabilitado) return;
    try {
      const ctx = obterAudioContext();
      if (!ctx) return;

      const notas = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const freqEscolhida = notas[Math.floor(Math.random() * notas.length)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqEscolhida, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEscolhida * 1.05, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // Falha silenciosa de áudio
    }
  };

  // 3. Som de Sucesso / Conquista / Baú Abrindo
  const tocarSucesso = () => {
    if (!somHabilitado) return;
    try {
      const ctx = obterAudioContext();
      if (!ctx) return;

      const tempoAtual = ctx.currentTime;
      const acordes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5

      acordes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const inicio = tempoAtual + index * 0.06;
        osc.frequency.setValueAtTime(freq, inicio);

        gain.gain.setValueAtTime(0.1, inicio);
        gain.gain.exponentialRampToValueAtTime(0.001, inicio + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(inicio);
        osc.stop(inicio + 0.3);
      });
    } catch {
      // Falha silenciosa de áudio
    }
  };

  const tocarSom = (tipo) => {
    switch (tipo) {
      case 'clique':
        tocarClique();
        break;
      case 'xp':
        tocarXP();
        break;
      case 'sucesso':
        tocarSucesso();
        break;
      default:
        tocarClique();
    }
  };

  return (
    <SoundContext.Provider
      value={{
        somHabilitado,
        alternarSom,
        tocarSom,
        tocarClique,
        tocarXP,
        tocarSucesso
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    return {
      somHabilitado: false,
      alternarSom: () => {},
      tocarSom: () => {},
      tocarClique: () => {},
      tocarXP: () => {},
      tocarSucesso: () => {}
    };
  }
  return context;
}
