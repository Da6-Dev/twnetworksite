import React from 'react';
import './Leaderboard.css';
import McIcon from './McIcon';

export default function Leaderboard() {
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
    <section id="ranking" className="leaderboard-section">
      <div className="leaderboard-header">
        <span className="badge-temporada">
          <McIcon name="Nether_Star" size={16} style={{ marginRight: '6px', verticalAlign: '-2px' }} />
          Temporada 1 • Em Disputa
        </span>
        <h2>Classificação & <span className="highlight">Prêmios em Dinheiro</span></h2>
        <p>Os jogadores no topo da economia no encerramento da temporada recebem premiações reais pagas via Pix.</p>
      </div>

      <div className="leaderboard-card-container">
        <div className="leaderboard-aviso">
          <span>
            <McIcon name="Clock" size={18} style={{ marginRight: '6px', verticalAlign: '-3px' }} />
            <strong>Encerramento da Temporada:</strong> Domingo às 23h59
          </span>
          <span className="total-premiacao">
            <McIcon name="Gold_Ingot" size={18} style={{ marginRight: '6px', verticalAlign: '-3px' }} />
            Total em Prêmios: <strong>R$ 400,00+</strong>
          </span>
        </div>

        <div className="tabela-wrapper">
          <table className="tabela-ranking">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Jogador</th>
                <th>Rank Atual</th>
                <th>Fortuna Acumulada</th>
                <th>Recompensa Sazonal</th>
              </tr>
            </thead>
            <tbody>
              {topJogadores.map((jogador) => (
                <tr key={jogador.posicao} className={`linha-pos-${jogador.posicao}`}>
                  <td className="col-pos">
                    <span className="pos-icone" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <McIcon name={jogador.mcIcon} size={24} />
                      <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>#{jogador.posicao}</span>
                    </span>
                  </td>
                  <td className="col-jogador">
                    <img 
                      src={`https://mc-heads.net/avatar/${jogador.nick}/32`} 
                      alt={jogador.nick} 
                      className="tabela-avatar"
                    />
                    <strong>{jogador.nick}</strong>
                  </td>
                  <td className="col-rank">
                    <span className="tag-rank">{jogador.nivelRank}</span>
                  </td>
                  <td className="col-saldo">{jogador.saldo}</td>
                  <td className="col-premio">
                    <span className="premio-destaque">{jogador.premio}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}