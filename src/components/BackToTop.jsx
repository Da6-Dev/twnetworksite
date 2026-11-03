import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import './BackToTop.css';

export default function BackToTop() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const controlarVisibilidade = () => {
      setVisivel(window.scrollY > 400);
    };

    window.addEventListener('scroll', controlarVisibilidade, { passive: true });
    return () => window.removeEventListener('scroll', controlarVisibilidade);
  }, []);

  const voltarAoTopo = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visivel) return null;

  return (
    <button 
      type="button"
      className="btn-back-to-top" 
      onClick={voltarAoTopo}
      title="Voltar ao início da página"
      aria-label="Voltar ao topo"
    >
      <ChevronUp size={20} />
    </button>
  );
}
