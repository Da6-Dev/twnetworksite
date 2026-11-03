import React, { useState } from 'react';
import { Terminal, ShieldAlert, HelpCircle, Users, MessageSquare } from 'lucide-react';
import AnimatedTabs from '../components/ui/AnimatedTabs';
import GuiaComandos from '../components/GuiaComandos';
import RegrasSection from '../components/RegrasSection';
import FaqSection from '../components/FaqSection';
import StaffSection from '../components/StaffSection';
import { useSound } from '../context/SoundContext';
import './GuiaPage.css';

export default function GuiaPage() {
  const [secaoAtiva, setSecaoAtiva] = useState('comandos');
  const { tocarClique } = useSound();

  const tabsGuia = [
    { id: 'comandos', label: 'Comandos do Jogo', icon: <Terminal size={16} /> },
    { id: 'regras', label: 'Regras & Diretrizes', icon: <ShieldAlert size={16} /> },
    { id: 'suporte', label: 'Suporte & Dúvidas (FAQ)', icon: <HelpCircle size={16} /> },
    { id: 'equipe', label: 'Equipe da Rede', icon: <Users size={16} /> }
  ];

  return (
    <div className="guia-page-container">
      {/* Header do Guia */}
      <section className="guia-hero-banner">
        <div className="guia-hero-content">
          <h1 className="guia-hero-title">
            Manual do Jogador &amp; Regulamento
          </h1>

          <p className="guia-hero-subtitle">
            Consulte comandos in-game, normas de conduta para manter sua conta protegida, prazos de entrega e atendimento oficial da equipe.
          </p>

          {/* Navegador de Abas com Framer Motion */}
          <div className="guia-tabs-wrapper">
            <AnimatedTabs
              tabs={tabsGuia}
              activeTab={secaoAtiva}
              onChange={(aba) => {
                tocarClique();
                setSecaoAtiva(aba);
              }}
              layoutId="guiaTabsIndicator"
            />
          </div>
        </div>
      </section>

      {/* Conteúdo da Seção Ativa */}
      <div className="guia-content-section">
        {secaoAtiva === 'comandos' && (
          <div className="guia-bloco-conteudo">
            <GuiaComandos />
          </div>
        )}

        {secaoAtiva === 'regras' && (
          <div className="guia-bloco-conteudo">
            <RegrasSection />
          </div>
        )}

        {secaoAtiva === 'suporte' && (
          <div className="guia-bloco-conteudo">
            <FaqSection />
            <div className="guia-suporte-extra">
              <div className="suporte-box">
                <div className="suporte-text">
                  <h3>Precisa de suporte em tempo real?</h3>
                  <p>
                    Nosso suporte oficial opera diariamente via Discord. Abra um ticket no canal <code>#suporte-tickets</code> e receba atendimento personalizado de um membro da equipe administrativa.
                  </p>
                </div>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-abrir-ticket"
                >
                  <MessageSquare size={16} />
                  <span>Abrir Ticket no Discord</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {secaoAtiva === 'equipe' && (
          <div className="guia-bloco-conteudo">
            <StaffSection />
          </div>
        )}
      </div>
    </div>
  );
}
