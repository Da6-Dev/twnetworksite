import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import VipShowcase from '../components/VipShowcase';
import NewsSection from '../components/NewsSection';
import Newsletter from '../components/Newsletter';
import McIcon from '../components/McIcon';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page-wrapper">
      {/* 1. Hero com Dock de Estatísticas ao Vivo & Botão de Conexão */}
      <Hero />

      {/* 2. Pilares & Diferenciais do RankUP */}
      <Features />

      {/* 3. Portais de Acesso Rápido — Navegação Dinâmica em Páginas Separadas */}
      <section className="home-portais-section">
        <div className="home-portais-header">
          <span className="badge-portais">
            <McIcon name="Compass" size={16} />
            Navegue na Rede
          </span>
          <h2>Explore a <span className="highlight">TW Network</span></h2>
          <p>Acesse rapidamente as áreas centrais do nosso servidor com páginas dedicadas e otimizadas.</p>
        </div>

        <div className="home-portais-grid">
          {/* Portal 1: Atividades & Pix */}
          <div className="portal-card">
            <div className="portal-icon-box">
              <McIcon name="Beacon" size={32} />
            </div>
            <div className="portal-body">
              <span className="portal-tag premio">Premiação Semanal</span>
              <h3>Hub de Atividades</h3>
              <p>
                Dispute o ranking da temporada valendo <strong>R$ 400+ em Pix</strong>, acompanhe o topo da economia e confira a lotação dos servidores ao vivo.
              </p>
            </div>
            <Link to="/atividades" className="portal-btn">
              <span>Abrir Hub de Atividades</span>
              <McIcon name="Gold_Ingot" size={16} />
            </Link>
          </div>

          {/* Portal 2: Guia do Jogador */}
          <div className="portal-card">
            <div className="portal-icon-box">
              <McIcon name="Book" size={32} />
            </div>
            <div className="portal-body">
              <span className="portal-tag info">Manual Oficial</span>
              <h3>Guia & Regulamento</h3>
              <p>
                Todos os comandos in-game com cópia rápida, regras oficiais de conduta e punições, central de suporte com FAQ e membros da equipe administrativa.
              </p>
            </div>
            <Link to="/guia" className="portal-btn">
              <span>Acessar Guia do Servidor</span>
              <McIcon name="Compass" size={16} />
            </Link>
          </div>

          {/* Portal 3: Loja VIP Oficial */}
          <div className="portal-card">
            <div className="portal-icon-box">
              <McIcon name="Emerald" size={32} />
            </div>
            <div className="portal-body">
              <span className="portal-tag loja">Ativação Instantânea</span>
              <h3>Loja VIP & Cash</h3>
              <p>
                Pacotes VIP permanentes e mensais, multiplicadores de venda, kits exclusivos e chaves com entrega automatizada via Pix e Cartão.
              </p>
            </div>
            <Link to="/loja" className="portal-btn destaque-loja">
              <span>Explorar Loja VIP</span>
              <McIcon name="Chest" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Showcase VIP & Economia */}
      <VipShowcase />

      {/* 5. Mural de Notícias & Atualizações Recentes */}
      <NewsSection />

      {/* 6. Newsletter & Cupons Exclusivos */}
      <Newsletter />
    </div>
  );
}
