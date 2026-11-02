import React, { useState } from 'react';
import './DailyRewards.css';
import McIcon from './McIcon';

export default function DailyRewards() {
  const [nick, setNick] = useState('');
  const [nickConfirmado, setNickConfirmado] = useState('');
  const [resgatado, setResgatado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const recompensas = [
    { dia: 'Dia 1', premio: '500 Moedas', mcIcon: 'Gold_Nugget' },
    { dia: 'Dia 2', premio: '1x Chave Comum', mcIcon: 'Tripwire_Hook' },
    { dia: 'Dia 3', premio: 'Booster de Mineração (30m)', mcIcon: 'Golden_Pickaxe' },
    { dia: 'Dia 4', premio: '2.500 Moedas', mcIcon: 'Gold_Ingot' },
    { dia: 'Dia 5', premio: '1x Chave Épica', mcIcon: 'Diamond' },
    { dia: 'Dia 6', premio: 'Booster de Economia (1h)', mcIcon: 'Fire_Charge' },
    { dia: 'Dia 7', premio: '1x Chave Suprema + Tag', mcIcon: 'Nether_Star' },
  ];

  const lidarConfirmacao = (e) => {
    e.preventDefault();
    if (!nick.trim()) return;

    setCarregando(true);
    setTimeout(() => {
      setNickConfirmado(nick.trim());
      setCarregando(false);
    }, 600);
  };

  const resgatarPresente = () => {
    setResgatado(true);
  };

  return (
    <section className="rewards-section">
      <div className="rewards-header">
        <h2>Recompensas Diárias da <span className="highlight">TW Network</span></h2>
        <p>Sincronize a sua conta do jogo e resgate brindes diários diretamente no servidor.</p>
      </div>

      <div className="rewards-container">
        {/* Painel de Identificação da Conta */}
        <div className="perfil-card">
          <div className="avatar-wrapper">
            <img
              src={
                nickConfirmado
                  ? `https://mc-heads.net/avatar/${nickConfirmado}/100`
                  : 'https://mc-heads.net/avatar/steve/100'
              }
              alt="Avatar do Jogador"
              className="player-avatar"
            />
          </div>

          <h3 className="perfil-nome">
            {nickConfirmado ? nickConfirmado : 'Jogador Convidado'}
          </h3>
          <p className="perfil-status">
            {nickConfirmado ? 'Conta Sincronizada' : 'Identifique-se para resgatar'}
          </p>

          <form onSubmit={lidarConfirmacao} className="form-nick">
            <input
              type="text"
              placeholder="Digite o seu Nick..."
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              className="input-nick"
            />
            <button type="submit" className="btn-sincronizar" disabled={carregando}>
              {carregando ? 'Buscando...' : 'Sincronizar'}
            </button>
          </form>

          {nickConfirmado && (
            <button
              onClick={resgatarPresente}
              disabled={resgatado}
              className={`btn-resgatar ${resgatado ? 'desativado' : ''}`}
            >
              {resgatado ? (
                <>✅ Presente Resgatado Hoje!</>
              ) : (
                <>
                  <McIcon name="Chest" size={22} style={{ marginRight: '8px' }} />
                  Resgatar Recompensa de Hoje
                </>
              )}
            </button>
          )}

          {resgatado && (
            <p className="aviso-entrega">
              Comando enviado para o servidor! Use <code>/recompensas</code> dentro do jogo para resgatar.
            </p>
          )}
        </div>

        {/* Trilha de Recompensas Semanais */}
        <div className="trilha-semanal">
          <h4>Calendário de Presentes da Temporada</h4>
          <div className="cards-trilha">
            {recompensas.map((item, index) => (
              <div
                key={index}
                className={`card-premio ${index === 0 && resgatado ? 'coletado' : ''}`}
              >
                <span className="card-dia">{item.dia}</span>
                <span className="card-icone">
                  <McIcon name={item.mcIcon} size={36} />
                </span>
                <span className="card-titulo">{item.premio}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}