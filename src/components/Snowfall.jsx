import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/useTheme';

export default function Snowfall() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animacaoId;

    const ajustarTamanho = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    ajustarTamanho();
    window.addEventListener('resize', ajustarTamanho);

    const totalFlocos = 50;
    const flocos = Array.from({ length: totalFlocos }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      raio: Math.random() * 2 + 1,
      velocidadeY: Math.random() * 1 + 0.5,
      velocidadeX: Math.random() * 0.5 - 0.25,
      opacidade: Math.random() * 0.4 + 0.3
    }));

    const animar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      flocos.forEach((floco) => {
        ctx.beginPath();
        ctx.arc(floco.x, floco.y, floco.raio, 0, Math.PI * 2);
        // Em dark mode: branco; Em light mode: azul gelo suave visível sobre fundo claro
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${floco.opacidade})`
          : `rgba(56, 189, 248, ${floco.opacidade * 0.75})`;
        ctx.fill();

        floco.y += floco.velocidadeY;
        floco.x += floco.velocidadeX;

        if (floco.y > canvas.height) {
          floco.y = -5;
          floco.x = Math.random() * canvas.width;
        }

        if (floco.x > canvas.width) floco.x = 0;
        if (floco.x < 0) floco.x = canvas.width;
      });

      animacaoId = requestAnimationFrame(animar);
    };

    animar();

    return () => {
      cancelAnimationFrame(animacaoId);
      window.removeEventListener('resize', ajustarTamanho);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  );
}