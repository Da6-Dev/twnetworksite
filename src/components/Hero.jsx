import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import McIcon from './McIcon';
import { useServerPing } from '../hooks/useServerPing';
import { serverInfo } from '../data/serverData';

export default function Hero() {
  const [copiado, setCopiado] = useState(false);
  const ipServidor = serverInfo.ip || "TWNetwork.com.br";
  const { totalOnline, capacidadeMaxima, versao, carregando } = useServerPing(ipServidor);

  const copiarIP = () => {
    navigator.clipboard.writeText(ipServidor);
    setCopiado(true);
    setTimeout(() => {
      setCopiado(false);
    }, 2000);
  };

  return (
    <section className="hero-container">
      <div className="hero-content">
        <div className="hero-tag-topo">
          <McIcon name="Nether_Star" size={16} />
          <span>Temporada 1 • RankUP & Economia Aberta</span>
        </div>

        <h1 className="hero-title">
          Sua Jornada Definitiva na <span className="highlight">TW Network</span>
        </h1>
        
        <p className="hero-subtitle">
          Explore o servidor de RankUP mais completo: minas progressivas com regeneração rápida, economia balanceada, leilões globais e premiações reais via Pix a cada temporada.
        </p>

        <div className="hero-buttons">
          <button 
            type="button"
            className={`btn-copiar ${copiado ? 'copiado' : ''}`} 
            onClick={copiarIP}
          >
            {copiado ? (
              <>
                <McIcon name="Emerald" size={20} />
                <span>IP Copiado com Sucesso!</span>
              </>
            ) : (
              <>
                <McIcon name="Compass" size={20} />
                <span>Copiar IP: <strong>{ipServidor}</strong></span>
              </>
            )}
          </button>
          
          <Link to="/loja" className="btn-loja">
            <McIcon name="Chest" size={20} />
            <span>Ver Loja & VIPs</span>
          </Link>

          <Link to="/guia" className="btn-guia-hero">
            <McIcon name="Book" size={20} />
            <span>Guia do Servidor</span>
          </Link>
        </div>

        {/* Dock de Estatísticas Rápidas Integrado */}
        <div className="hero-stats-dock">
          <div className="dock-stat-item">
            <span className="dock-stat-status">
              <span className="status-dot"></span>
              {carregando ? 'Verificando...' : `${totalOnline} / ${capacidadeMaxima} Online`}
            </span>
            <span className="dock-stat-label">Jogadores Conectados</span>
          </div>

          <div className="dock-stat-divisor"></div>

          <div className="dock-stat-item">
            <span className="dock-stat-valor" style={{ color: 'var(--mc-star-gold)' }}>
              <McIcon name="Gold_Ingot" size={18} />
              R$ 400,00+ via Pix
            </span>
            <span className="dock-stat-label">Premiação da Temporada</span>
          </div>

          <div className="dock-stat-divisor"></div>

          <div className="dock-stat-item">
            <span className="dock-stat-valor" style={{ color: 'var(--mc-frost-ice)' }}>
              <McIcon name="Beacon" size={18} />
              {versao}
            </span>
            <span className="dock-stat-label">Multi-Versão Suportada</span>
          </div>
        </div>
      </div>
    </section>
  );
}