import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Radio, Clock, Crown, ArrowRight, RefreshCw } from 'lucide-react';
import AnimatedTabs from './ui/AnimatedTabs';
import McIcon from './McIcon';
import { useServerPing } from '../hooks/useServerPing';
import { serverInfo } from '../data/serverData';
import { useSound } from '../context/SoundContext';
import './PlayerHub.css';

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
      tier: 'ouro'
    },
    {
      posicao: 2,
      nick: 'Minerador_Pro',
      nivelRank: 'Titã III',
      saldo: 'R$ 112.450.000',
      premio: 'R$ 100,00 via Pix',
      tier: 'prata'
    },
    {
      posicao: 3,
      nick: 'ShadowCrafter',
      nivelRank: 'Campeão I',
      saldo: 'R$ 88.900.000',
      premio: 'R$ 50,00 via Pix',
      tier: 'bronze'
    },
    {
      posicao: 4,
      nick: 'Alex_Master',
      nivelRank: 'Lorde II',
      saldo: 'R$ 64.200.000',
      premio: 'VIP Supremo + 50k Cash'
    },
    {
      posicao: 5,
      nick: 'ValkyriePvP',
      nivelRank: 'Lorde I',
      saldo: 'R$ 51.700.000',
      premio: 'VIP Esmeralda + 25k Cash'
    }
  ];

  const tabsHub = [
    { id: 'ranking', label: 'Ranking da Temporada (Pix)', icon: <Trophy size={16} /> },
    { id: 'status', label: 'Status dos Servidores', icon: <Radio size={16} /> }
  ];

  const podiumOrder = [topJogadores[1], topJogadores[0], topJogadores[2]];

  return (
    <section id="hub" className="player-hub-section">
      {/* Banner de Direcionamento para Perfil */}
      <div className="hub-perfil-aviso-banner">
        <div className="aviso-banner-icone">
          <McIcon name="Chest" size={28} />
        </div>
        <div className="aviso-banner-texto">
          <strong>Recompensas Diárias &amp; Passe de Batalha</strong>
          <p>Seu calendário de 7 dias e as missões do passe agora são resgatados no seu perfil com seu Nick!</p>
        </div>
        <Link to="/perfil" className="btn-ir-perfil-hub" onClick={() => tocarClique()}>
          <span>Abrir Meu Perfil</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Navegador de Abas com Framer Motion */}
      <div className="hub-tabs-wrapper">
        <AnimatedTabs
          tabs={tabsHub}
          activeTab={abaAtiva}
          onChange={(tab) => {
            tocarClique();
            setAbaAtiva(tab);
          }}
          layoutId="hubTabsIndicator"
        />
      </div>

      {/* Conteúdo Dinâmico */}
      <div className="hub-card-wrapper">
        {abaAtiva === 'ranking' && (
          <div className="hub-ranking-box">
            <div className="hub-ranking-topo">
              <div className="hub-ranking-alerta">
                <Clock size={16} />
                <span>Encerramento: <strong>Domingo às 23h59</strong></span>
              </div>
              <div className="hub-ranking-total">
                <Trophy size={16} className="text-amber-400" />
                <span>Premiação Semanal: <strong>R$ 400,00+ via Pix</strong></span>
              </div>
            </div>

            {/* PÓDIO TOP 3 VISUAL */}
            <div className="podium-container">
              {podiumOrder.map((jogador) => {
                const isPrimeiro = jogador.posicao === 1;
                return (
                  <div
                    key={jogador.posicao}
                    className={`podium-card podium-${jogador.tier} ${isPrimeiro ? 'podium-first' : ''}`}
                  >
                    {isPrimeiro && (
                      <div className="podium-crown">
                        <Crown size={26} className="text-amber-300" />
                      </div>
                    )}
                    <span className="podium-rank-badge">#{jogador.posicao}</span>
                    <img
                      src={`https://mc-heads.net/avatar/${jogador.nick}/${isPrimeiro ? 64 : 48}`}
                      alt={jogador.nick}
                      className="podium-avatar"
                    />
                    <strong className="podium-nick">{jogador.nick}</strong>
                    <span className="podium-cargo">{jogador.nivelRank}</span>
                    <div className="podium-premio">{jogador.premio}</div>
                    <span className="podium-saldo">{jogador.saldo}</span>
                  </div>
                );
              })}
            </div>

            {/* TABELA COM DEMAIS POSIÇÕES */}
            <div className="hub-tabela-overflow">
              <table className="hub-tabela">
                <thead>
                  <tr>
                    <th>Posição</th>
                    <th>Jogador</th>
                    <th>Patente</th>
                    <th>Fortuna Total</th>
                    <th>Premiação</th>
                  </tr>
                </thead>
                <tbody>
                  {topJogadores.map((jogador) => (
                    <tr key={jogador.posicao} className={`pos-linha-${jogador.posicao}`}>
                      <td>
                        <span className="hub-pos-chip">#{jogador.posicao}</span>
                      </td>
                      <td>
                        <div className="hub-jogador-col">
                          <img
                            src={`https://mc-heads.net/avatar/${jogador.nick}/28`}
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

        {abaAtiva === 'status' && (
          <div className="hub-status-box">
            <div className="hub-status-bar">
              <div className="hub-bar-item">
                <span className="hub-bar-label">Endereço IP:</span>
                <span className="hub-bar-valor destaque-ip">{serverInfo.ip}</span>
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
                  title="Atualizar dados de conexão"
                >
                  <RefreshCw size={15} />
                  <span>{ultimaAtualizacao || 'Atualizar'}</span>
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
                      />
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
