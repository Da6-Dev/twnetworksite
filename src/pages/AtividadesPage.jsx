import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PlayerHub from '../components/PlayerHub';
import McIcon from '../components/McIcon';
import './AtividadesPage.css';

export default function AtividadesPage() {
  return (
    <div className="atividades-page-container">
      {/* Cabeçalho da Página de Atividades */}
      <section className="atividades-hero-banner">
        <div className="atividades-hero-content">
          <h1 className="atividades-title">
            Central de Atividades &amp; Competição Sazonal
          </h1>

          <p className="atividades-subtitle">
            Acompanhe a disputa pela premiação semanal de R$ 400+ em Pix, monitore a lotação dos servidores ao vivo e recolha recompensas diárias no seu perfil.
          </p>

          <div className="atividades-quick-stats">
            <div className="stat-pill">
              <McIcon name="Totem_Of_Undying" size={22} />
              <div>
                <strong>R$ 400,00+</strong>
                <small>Prêmio Semanal em Pix</small>
              </div>
            </div>

            <Link to="/perfil" className="stat-pill stat-link-pill">
              <McIcon name="Chest" size={22} />
              <div>
                <strong>Passe &amp; Calendário</strong>
                <small>Resgatar no Perfil</small>
              </div>
            </Link>

            <div className="stat-pill">
              <McIcon name="Clock" size={22} />
              <div>
                <strong>Domingos às 23h59</strong>
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
            O jogador com a maior fortuna líquida acumulada no RankUP até o fechamento da semana recebe <strong>R$ 250,00</strong> diretamente na chave Pix. Os 2º e 3º colocados recebem R$ 100,00 e R$ 50,00.
          </p>
          <Link to="/guia" className="info-card-link">
            <span>Ver Regras Oficiais</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="info-card">
          <div className="info-card-header">
            <McIcon name="Chest" size={24} />
            <h3>Passe &amp; Recompensas Diárias</h3>
          </div>
          <p>
            Acesse seu perfil autenticado para marcar presença no calendário diário de 7 dias com bônus progressivos e subir de nível na trilha do Passe de Batalha da Temporada.
          </p>
          <Link to="/perfil" className="info-card-link">
            <span>Abrir Meu Perfil</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="info-card">
          <div className="info-card-header">
            <McIcon name="Gold_Ingot" size={24} />
            <h3>Multiplicadores de Venda VIP</h3>
          </div>
          <p>
            Os planos VIP contam com boost acumulativo na venda de minérios e colheitas, permitindo acelerar sua ascensão econômica rumo ao topo do ranking.
          </p>
          <Link to="/loja" className="info-card-link">
            <span>Ver Planos VIP</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
