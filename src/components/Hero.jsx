import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useServerPing } from '../hooks/useServerPing';
import { serverInfo } from '../data/serverData';
import { useSound } from '../context/SoundContext';
import McIcon from './McIcon';
import './Hero.css';

export default function Hero() {
  const [copiado, setCopiado] = useState(false);
  const ipServidor = serverInfo.ip || "TWNetwork.com.br";
  const { totalOnline, capacidadeMaxima, versao, carregando } = useServerPing(ipServidor);
  const { tocarXP, tocarClique } = useSound();

  const copiarIP = () => {
    tocarXP();
    navigator.clipboard.writeText(ipServidor);
    setCopiado(true);
    toast.success(`IP ${ipServidor} copiado! Cole no seu Minecraft e jogue agora.`);
    setTimeout(() => {
      setCopiado(false);
    }, 2000);
  };

  return (
    <section className="hero-container">
      <div className="hero-content">
        <div className="hero-tag-topo">
          <span className="live-pulse-dot" />
          <span>Temporada 1 • RankUP &amp; Economia Aberta</span>
        </div>

        <h1 className="hero-title">
          Construa seu império e dispute prêmios reais na TW Network
        </h1>
        
        <p className="hero-subtitle">
          Minas progressivas com regeneração instantânea, mercado dinâmico de economia, leilões globais e premiação semanal de R$ 400+ via Pix para os maiores magnatas do servidor.
        </p>

        <div className="hero-buttons">
          <button 
            type="button"
            className={`btn-copiar-ip ${copiado ? 'copiado' : ''}`} 
            onClick={copiarIP}
            title="Clique para copiar o IP do servidor"
          >
            <span className="ip-label">Servidor Oficial</span>
            <strong className="ip-address">{ipServidor}</strong>
            <span className="ip-copy-badge">
              {copiado ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiado ? 'Copiado' : 'Copiar IP'}</span>
            </span>
          </button>
          
          <div className="hero-secondary-actions">
            <Link to="/loja" className="btn-loja-hero" onClick={() => tocarClique()}>
              <McIcon name="Gold_Ingot" size={20} />
              <span>Conhecer Loja VIP</span>
            </Link>

            <Link to="/guia" className="btn-guia-hero" onClick={() => tocarClique()}>
              <McIcon name="Enchanted_Book" size={20} />
              <span>Guia do Servidor</span>
            </Link>
          </div>
        </div>

        {/* Dock de Estatísticas ao Vivo */}
        <div className="hero-stats-dock">
          <div className="dock-stat-item">
            <div className="dock-stat-icon">
              <McIcon name="Compass" size={22} />
            </div>
            <div className="dock-stat-text">
              <span className="dock-stat-valor">
                {carregando ? 'Conectando...' : `${totalOnline} / ${capacidadeMaxima}`}
              </span>
              <span className="dock-stat-label">Jogadores Conectados</span>
            </div>
          </div>

          <div className="dock-stat-divisor" />

          <div className="dock-stat-item">
            <div className="dock-stat-icon">
              <McIcon name="Totem_Of_Undying" size={22} />
            </div>
            <div className="dock-stat-text">
              <span className="dock-stat-valor" style={{ color: 'var(--mc-star-gold)' }}>
                R$ 400,00+ via Pix
              </span>
              <span className="dock-stat-label">Premiação Semanal</span>
            </div>
          </div>

          <div className="dock-stat-divisor" />

          <div className="dock-stat-item">
            <div className="dock-stat-icon">
              <McIcon name="Grass_Block" size={22} />
            </div>
            <div className="dock-stat-text">
              <span className="dock-stat-valor" style={{ color: 'var(--mc-frost-ice)' }}>
                {versao || '1.8 — 1.20+'}
              </span>
              <span className="dock-stat-label">Compatibilidade Total</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
