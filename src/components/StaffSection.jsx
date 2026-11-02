import React, { useState } from 'react';
import './StaffSection.css';
import McIcon from './McIcon';

export default function StaffSection() {
  const [avisoCandidatura, setAvisoCandidatura] = useState(false);

  const membros = [
    {
      nick: 'TeDabliukkkkk',
      cargo: 'Fundador & Desenvolvedor',
      classe: 'fundador',
      mcIcon: 'Nether_Star',
      responsabilidade: 'Gestão geral da infraestrutura, arquitetura de plugins exclusivos e balanceamento econômico da rede.'
    },
    {
      nick: 'AdminTW',
      cargo: 'Administrador Geral',
      classe: 'admin',
      mcIcon: 'Diamond_Sword',
      responsabilidade: 'Supervisão de eventos sazonais, suporte direto à loja e coordenação dos processos da equipe.'
    },
    {
      nick: 'ModCraft',
      cargo: 'Moderador Sênior',
      classe: 'mod',
      mcIcon: 'Iron_Sword',
      responsabilidade: 'Fiscalização ativa de denúncias, aplicação rigorosa das diretrizes e combate a modificações ilícitas.'
    },
    {
      nick: 'AjudanteTW',
      cargo: 'Ajudante & Suporte',
      classe: 'ajudante',
      mcIcon: 'Golden_Apple',
      responsabilidade: 'Boas-vindas a novos jogadores, esclarecimento de dúvidas no chat e atendimento de tickets in-game.'
    }
  ];

  return (
    <section id="equipe" className="staff-section">
      <div className="staff-header">
        <span className="badge-secao-staff">
          <McIcon name="Nether_Star" size={16} />
          Administração & Moderação
        </span>
        <h2>Equipe da <span className="highlight">TW Network</span></h2>
        <p>Conheça os responsáveis pela administração, suporte técnico e integridade das partidas no servidor.</p>
      </div>

      <div className="staff-grid">
        {membros.map((membro, index) => (
          <div key={index} className="staff-card">
            <div className="staff-avatar-box">
              <img
                src={`https://mc-heads.net/avatar/${membro.nick}/80`}
                alt={membro.nick}
                className="staff-avatar"
              />
            </div>

            <h3 className="staff-nick">{membro.nick}</h3>
            
            <div className={`staff-badge ${membro.classe}`}>
              <McIcon name={membro.mcIcon} size={15} />
              <span>{membro.cargo}</span>
            </div>

            <p className="staff-desc">{membro.responsabilidade}</p>
          </div>
        ))}
      </div>

      <div className="recrutamento-banner">
        <div className="recrutamento-info">
          <div className="recrutamento-titulo-box">
            <McIcon name="Chest" size={24} />
            <h3>Quer fazer parte da equipe da TW Network?</h3>
          </div>
          <p>
            Buscamos constantemente jogadores dedicados, maduros e prestativos para as funções de Suporte e Ajudante.
          </p>
          {avisoCandidatura && (
            <div className="aviso-candidatura-card">
              <div className="aviso-candidatura-linha">
                <McIcon name="Emerald" size={16} />
                <strong>Requisitos Básicos:</strong> Idade mínima de 15 anos, microfone funcional, tempo diário disponível e bom histórico na rede.
              </div>
              <div className="aviso-candidatura-linha">
                <McIcon name="Compass" size={16} />
                <strong>Como se candidatar:</strong> As fichas de inscrição são divulgadas na sala <code>#formularios</code> do nosso Discord oficial antes da abertura de cada temporada!
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          className="btn-candidatura"
          onClick={() => setAvisoCandidatura(!avisoCandidatura)}
        >
          <McIcon name={avisoCandidatura ? 'Barrier' : 'Paper'} size={18} />
          {avisoCandidatura ? 'Ocultar Requisitos' : 'Ver Requisitos de Inscrição'}
        </button>
      </div>
    </section>
  );
}