import React from 'react';
import PlayerHub from '../components/PlayerHub';
import McIcon from '../components/McIcon';
import './HubPage.css';

export default function HubPage() {
  return (
    <div className="hub-page-container">
      <div className="hub-page-banner">
        <span className="hub-page-tag">
          <McIcon name="Nether_Star" size={16} />
          Central de Jogadores
        </span>
        <h1>Hub de <span className="highlight">Atividades</span></h1>
        <p>
          Vincule seu Nick para resgatar brindes diários, acompanhe em tempo real os líderes da economia na disputa pelos prêmios em Pix e confira a lotação dos servidores.
        </p>
      </div>

      <PlayerHub />
    </div>
  );
}
