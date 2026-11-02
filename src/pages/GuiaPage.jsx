import React, { useState } from 'react';
import McIcon from '../components/McIcon';
import GuiaComandos from '../components/GuiaComandos';
import RegrasSection from '../components/RegrasSection';
import FaqSection from '../components/FaqSection';
import StaffSection from '../components/StaffSection';
import './GuiaPage.css';

export default function GuiaPage() {
  const [secaoAtiva, setSecaoAtiva] = useState('comandos');

  const abas = [
    { id: 'comandos', nome: 'Comandos do Servidor', mcIcon: 'Compass', desc: 'Atalhos e comandos in-game' },
    { id: 'regras', nome: 'Regras & Diretrizes', mcIcon: 'Paper', desc: 'Normas de conduta e punições' },
    { id: 'suporte', nome: 'Suporte & Dúvidas (FAQ)', mcIcon: 'Book', desc: 'Perguntas frequentes e prazos' },
    { id: 'equipe', nome: 'Equipe & Recrutamento', mcIcon: 'Nether_Star', desc: 'Administração e moderação' }
  ];

  return (
    <div className="guia-page-container">
      {/* Header do Guia */}
      <section className="guia-hero-banner">
        <div className="guia-hero-content">
          <div className="guia-hero-badge">
            <McIcon name="Book" size={18} />
            <span>Manual Oficial do Jogador</span>
          </div>

          <h1 className="guia-hero-title">
            Guia Completo da <span className="highlight">TW Network</span>
          </h1>

          <p className="guia-hero-subtitle">
            Tudo o que você precisa para dominar o RankUP: consulte comandos in-game, leia as regras para manter sua conta segura, tire dúvidas de suporte e conheça a nossa equipe.
          </p>

          {/* Navegador de Abas do Guia */}
          <div className="guia-nav-tabs">
            {abas.map((aba) => {
              const isAtiva = secaoAtiva === aba.id;
              return (
                <button
                  key={aba.id}
                  type="button"
                  className={`guia-nav-btn ${isAtiva ? 'ativo' : ''}`}
                  onClick={() => setSecaoAtiva(aba.id)}
                >
                  <McIcon name={aba.mcIcon} size={20} />
                  <div className="guia-nav-btn-info">
                    <strong>{aba.nome}</strong>
                    <small>{aba.desc}</small>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seção Exibida */}
      <div className="guia-content-section">
        {secaoAtiva === 'comandos' && (
          <div className="guia-bloco-conteudo fade-in">
            <GuiaComandos />
          </div>
        )}

        {secaoAtiva === 'regras' && (
          <div className="guia-bloco-conteudo fade-in">
            <RegrasSection />
          </div>
        )}

        {secaoAtiva === 'suporte' && (
          <div className="guia-bloco-conteudo fade-in">
            <FaqSection />
            <div className="guia-suporte-extra">
              <div className="suporte-box">
                <McIcon name="Clock" size={28} />
                <div className="suporte-text">
                  <h3>Precisa de atendimento em tempo real?</h3>
                  <p>
                    Nosso suporte oficial opera diariamente via Discord. Abra um ticket no canal <code>#suporte-tickets</code> e receba atendimento personalizado de um membro da equipe.
                  </p>
                </div>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-abrir-ticket"
                >
                  <McIcon name="Compass" size={16} />
                  Abrir Ticket no Discord
                </a>
              </div>
            </div>
          </div>
        )}

        {secaoAtiva === 'equipe' && (
          <div className="guia-bloco-conteudo fade-in">
            <StaffSection />
          </div>
        )}
      </div>
    </div>
  );
}
