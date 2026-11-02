import React from 'react';
import { Link } from 'react-router-dom';
import PlayerHub from '../components/PlayerHub';
import McIcon from '../components/McIcon';
import './AtividadesPage.css';

export default function AtividadesPage() {
  return (
    <div className="atividades-page-container">
      {/* Cabeçalho da Página de Atividades */}
      <section className="atividades-hero-banner">
        <div className="atividades-hero-content">
          <div className="atividades-badge">
            <McIcon name="Beacon" size={18} />
            <span>Hub Central de Atividades</span>
          </div>

          <h1 className="atividades-title">
            Rankings & Atividades da <span className="highlight">TW Network</span>
          </h1>

          <p className="atividades-subtitle">
            Acompanhe em tempo real a disputa pela premiação semanal em Pix, monitore a lotação de todos os servidores e acesse seu perfil para recolher recompensas e evoluir no Passe de Batalha.
          </p>

          <div className="atividades-quick-stats">
            <div className="stat-pill">
              <McIcon name="Gold_Ingot" size={20} />
              <div>
                <strong>R$ 400,00+</strong>
                <small>Prêmio Semanal em Pix</small>
              </div>
            </div>

            <Link to="/perfil" className="stat-pill stat-link-pill">
              <McIcon name="Chest" size={20} />
              <div>
                <strong>Passe & Calendário</strong>
                <small>Resgate no Perfil →</small>
              </div>
            </Link>

            <div className="stat-pill">
              <McIcon name="Clock" size={20} />
              <div>
                <strong>Domingos 23h59</strong>
                <small>Fechamento do Ranking</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Componente Interativo do Hub */}
      <div className="atividades-hub-wrapper">
        <PlayerHub />
      </div>

      {/* Dicas e FAQ Rápido sobre as Atividades */}
      <section className="atividades-info-cards">
        <div className="info-card">
          <div className="info-card-header">
            <McIcon name="Totem_Of_Undying" size={24} />
            <h3>Como Funciona o Ranking Pix?</h3>
          </div>
          <p>
            O jogador que acumular a maior fortuna líquida no RankUP até o fechamento da semana leva o prêmio principal de <strong>R$ 250,00</strong> diretamente na chave Pix. Os 2º e 3º lugares recebem R$ 100,00 e R$ 50,00 respectivamente.
          </p>
          <Link to="/guia" className="info-card-link">
            Ver Regras do Ranking →
          </Link>
        </div>

        <div className="info-card">
          <div className="info-card-header">
            <McIcon name="Chest" size={24} />
            <h3>Passe de Batalha & Calendário Diário</h3>
          </div>
          <p>
            Acesse seu perfil autenticado para recolher o calendário de 7 dias com bônus progressivos e desbloquear níveis na trilha Free ou VIP do Passe de Batalha da Temporada.
          </p>
          <Link to="/perfil" className="info-card-link">
            Abrir Meu Perfil do Jogador →
          </Link>
        </div>

        <div className="info-card">
          <div className="info-card-header">
            <McIcon name="Emerald" size={24} />
            <h3>Quer Acelerar sua Evolução?</h3>
          </div>
          <p>
            Os pacotes VIP oferecem multiplicadores permanentes de venda (sell boost), acesso a minas exclusivas e kits diários que impulsionam seu lugar no ranking.
          </p>
          <Link to="/loja" className="info-card-link">
            Conhecer Pacotes VIP →
          </Link>
        </div>
      </section>
    </div>
  );
}
