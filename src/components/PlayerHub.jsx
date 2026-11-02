import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PlayerHub.css';
import McIcon from './McIcon';
import { useServerPing } from '../hooks/useServerPing';
import { serverInfo } from '../data/serverData';
import { useSound } from '../context/SoundContext';

export default function PlayerHub() {
  const [abaAtiva, setAbaAtiva] = useState('ranking');

  const { totalOnline, capacidadeMaxima, versao, carregando, ultimaAtualizacao, atualizar } = useServerPing(serverInfo.ip);
  const { tocarClique } = useSound();

  const topJogadores = [
    {
      posicao: 1,
      nick: 'TeDabliukkkkk',
      nivelRank: 'Deus Supremo',
      saldo: 'R$ 150.000.000',
      premio: 'R$ 250,00 via Pix',
      mcIcon: 'Totem_Of_Undying'
    },
    {
      posicao: 2,
      nick: 'Minerador_Pro',
      nivelRank: 'Titã III',
      saldo: 'R$ 112.450.000',
      premio: 'R$ 100,00 via Pix',
      mcIcon: 'Diamond'
    },
    {
      posicao: 3,
      nick: 'ShadowCrafter',
      nivelRank: 'Campeão I',
      saldo: 'R$ 88.900.000',
      premio: 'R$ 50,00 via Pix',
      mcIcon: 'Iron_Ingot'
    },
    {
      posicao: 4,
      nick: 'Alex_Master',
      nivelRank: 'Lorde II',
      saldo: 'R$ 64.200.000',
      premio: 'VIP Supremo + 50k Cash',
      mcIcon: 'Gold_Ingot'
    },
    {
      posicao: 5,
      nick: 'ValkyriePvP',
      nivelRank: 'Lorde I',
      saldo: 'R$ 51.700.000',
      premio: 'VIP Esmeralda + 25k Cash',
      mcIcon: 'Emerald'
    }
  ];

  return (
    <section id="hub" className="player-hub-section">
      <div className="hub-header">
        <span className="badge-secao-hub">
          <McIcon name="Nether_Star" size={16} />
          Central da Comunidade
        </span>
        <h2>Hub & Rankings da <span className="highlight">TW Network</span></h2>
        <p>Acompanhe a disputa em tempo real pela premiação semanal em Pix e monitore a lotação de todas as salas.</p>
      </div>

      {/* Banner de Direcionamento para Recompensas & Passe no Perfil */}
      <div className="hub-perfil-aviso-banner">
        <div className="aviso-banner-icone">
          <McIcon name="Chest" size={28} />
        </div>
        <div className="aviso-banner-texto">
          <strong>Recompensas Diárias & Passe de Batalha</strong>
          <p>Seus presentes diários e a trilha do passe agora são resgatados diretamente no seu perfil vinculado ao seu Nick!</p>
        </div>
        <Link to="/perfil" className="btn-ir-perfil-hub" onClick={() => tocarClique()}>
          <McIcon name="Nether_Star" size={16} />
          <span>Abrir Meu Perfil</span>
        </Link>
      </div>

      {/* Navegador de Abas do Hub */}
      <div className="hub-tabs-container">
        <button
          type="button"
          className={`hub-tab-btn ${abaAtiva === 'ranking' ? 'ativo' : ''}`}
          onClick={() => {
            tocarClique();
            setAbaAtiva('ranking');
          }}
        >
          <McIcon name="Gold_Ingot" size={20} />
          <span>Ranking da Temporada (Pix)</span>
        </button>

        <button
          type="button"
          className={`hub-tab-btn ${abaAtiva === 'status' ? 'ativo' : ''}`}
          onClick={() => {
            tocarClique();
            setAbaAtiva('status');
          }}
        >
          <McIcon name="Beacon" size={20} />
          <span>Status dos Modos</span>
        </button>
      </div>

      {/* Conteúdo Dinâmico da Aba Ativa */}
      <div className="hub-card-wrapper">

        {/* ABA 2: RANKING & PREMIAÇÕES PIX */}
        {abaAtiva === 'ranking' && (
          <div className="hub-ranking-box">
            <div className="hub-ranking-topo">
              <div className="hub-ranking-alerta">
                <McIcon name="Clock" size={18} />
                <span>Encerramento da Temporada: <strong>Domingo às 23h59</strong></span>
              </div>
              <div className="hub-ranking-total">
                <McIcon name="Gold_Ingot" size={18} />
                <span>Total em Prêmios: <strong>R$ 400,00+ via Pix</strong></span>
              </div>
            </div>

            <div className="hub-tabela-overflow">
              <table className="hub-tabela">
                <thead>
                  <tr>
                    <th>Posição</th>
                    <th>Jogador</th>
                    <th>Patente / Rank</th>
                    <th>Fortuna Total</th>
                    <th>Premiação Sazonal</th>
                  </tr>
                </thead>
                <tbody>
                  {topJogadores.map((jogador) => (
                    <tr key={jogador.posicao} className={`pos-linha-${jogador.posicao}`}>
                      <td>
                        <span className="hub-pos-chip">
                          <McIcon name={jogador.mcIcon} size={20} />
                          #{jogador.posicao}
                        </span>
                      </td>
                      <td>
                        <div className="hub-jogador-col">
                          <img
                            src={`https://mc-heads.net/avatar/${jogador.nick}/32`}
                            alt={jogador.nick}
                            className="hub-avatar-mini"
                          />
                          <strong>{jogador.nick}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="hub-rank-tag">{jogador.nivelRank}</span>
                      </td>
                      <td>
                        <span className="hub-saldo-texto">{jogador.saldo}</span>
                      </td>
                      <td>
                        <span className="hub-premio-tag">{jogador.premio}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 3: STATUS DOS MODOS DE JOGO */}
        {abaAtiva === 'status' && (
          <div className="hub-status-box">
            <div className="hub-status-bar">
              <div className="hub-bar-item">
                <span className="hub-bar-label">Endereço IP:</span>
                <span className="hub-bar-valor destaque-ip">
                  <McIcon name="Compass" size={16} />
                  {serverInfo.ip}
                </span>
              </div>
              <div className="hub-bar-item">
                <span className="hub-bar-label">Total Conectado:</span>
                <span className="hub-bar-valor destaque-online">
                  {carregando ? 'Sincronizando...' : `${totalOnline} / ${capacidadeMaxima}`}
                </span>
              </div>
              <div className="hub-bar-item">
                <span className="hub-bar-label">Versão Suportada:</span>
                <span className="hub-bar-valor">{versao}</span>
              </div>
              <div className="hub-bar-item">
                <button
                  type="button"
                  className={`btn-sync-ping ${carregando ? 'girando' : ''}`}
                  onClick={() => {
                    tocarClique();
                    atualizar();
                  }}
                  title="Atualizar ping"
                >
                  🔄 {ultimaAtualizacao || 'Atualizar'}
                </button>
              </div>
            </div>

            <div className="hub-modos-grid">
              {serverInfo.modos.map((modo) => (
                <div key={modo.id} className="hub-modo-card">
                  <div className="hub-modo-topo">
                    <span className="hub-modo-tipo">
                      <McIcon name={modo.mcIcon} size={16} />
                      {modo.tipo}
                    </span>
                    <span className={`hub-modo-pill ${modo.online ? 'online' : 'offline'}`}>
                      {modo.online ? '● Online' : '○ Manutenção'}
                    </span>
                  </div>

                  <h4>{modo.nome}</h4>
                  <p>{modo.descricao}</p>

                  <div className="hub-modo-capacidade">
                    <div className="hub-capacidade-info">
                      <span>Lotação:</span>
                      <strong>{modo.jogadores} / {modo.maxJogadores}</strong>
                    </div>
                    <div className="hub-progresso-fundo">
                      <div
                        className="hub-progresso-barra"
                        style={{ width: `${modo.online ? (modo.jogadores / modo.maxJogadores) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
