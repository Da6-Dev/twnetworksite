import React, { useState } from 'react';
import McIcon from './McIcon';
import { ranksNatalinos, prestigiosEndGame } from '../data/serverData';
import { useSound } from '../context/SoundContext';
import './RanksSection.css';

export default function RanksSection() {
  const [abaProgresso, setAbaProgresso] = useState('ranks');
  const { tocarClique } = useSound();

  return (
    <section className="ranks-section-container">
      <div className="ranks-section-header">
        <h2>Progressão de Ranks &amp; Prestígios</h2>
        <p>
          Avance pelos 11 Ranks Natalinos minerando e comercializando na economia da TW Network. Ao atingir o nível máximo (Noel/MAX), reinicie sua jornada nos Prestígios End Game para desbloquear multiplicadores permanentes de até <strong>3.0x</strong>!
        </p>
      </div>

      {/* Dicas Rápidas de Atalhos */}
      <div className="ranks-dicas-box">
        <div className="dica-card">
          <McIcon name="Diamond_Pickaxe" size={24} />
          <div>
            <strong>Subir Ranks Automaticamente</strong>
            <p>Use o comando <code>/rankupmax</code> para gastar todo seu saldo e subir múltiplos ranks de uma só vez!</p>
          </div>
        </div>
        <div className="dica-card">
          <McIcon name="Totem_Of_Undying" size={24} />
          <div>
            <strong>Ciclo de Prestígio</strong>
            <p>Use <code>/prestigio</code> após atingir o rank Noel para ativar os multiplicadores Grinch, Yeti e Krampus.</p>
          </div>
        </div>
      </div>

      {/* Alternador de Visualização */}
      <div className="ranks-nav-pills">
        <button
          type="button"
          className={`pill-btn ${abaProgresso === 'ranks' ? 'ativo' : ''}`}
          onClick={() => {
            tocarClique();
            setAbaProgresso('ranks');
          }}
        >
          <McIcon name="Emerald" size={18} />
          <span>11 Ranks Natalinos (Progressão)</span>
        </button>

        <button
          type="button"
          className={`pill-btn ${abaProgresso === 'prestigios' ? 'ativo' : ''}`}
          onClick={() => {
            tocarClique();
            setAbaProgresso('prestigios');
          }}
        >
          <McIcon name="Nether_Star" size={18} />
          <span>Prestígios End Game (Multiplicadores)</span>
        </button>
      </div>

      {/* Conteúdo: Tabela de Ranks */}
      {abaProgresso === 'ranks' && (
        <div className="ranks-tabela-wrapper">
          <div className="ranks-cards-grid">
            {ranksNatalinos.map((rank, index) => (
              <div key={rank.id} className="rank-progresso-card">
                <div className="rank-card-topo">
                  <div className="rank-icone-box">
                    <McIcon name={rank.mcIcon} size={28} />
                  </div>
                  <div className="rank-titulos">
                    <span className="rank-posicao">Nível #{index + 1}</span>
                    <h4 style={{ color: rank.tagCor }}>{rank.nome}</h4>
                  </div>
                  <span className="rank-tag-badge" style={{ borderColor: rank.tagCor, color: rank.tagCor }}>
                    {rank.tag}
                  </span>
                </div>

                <div className="rank-card-corpo">
                  <div className="rank-linha-custo">
                    <span className="label-custo">Custo de Evolução:</span>
                    <strong className="valor-custo">{rank.custo}</strong>
                  </div>

                  <p className="rank-vantagens-texto">{rank.vantagens}</p>
                </div>

                <div className="rank-card-rodape">
                  {rank.broadcast && (
                    <span className="badge-broadcast">
                      📢 Broadcast Global ao Evoluir
                    </span>
                  )}
                  {rank.proximo && (
                    <span className="badge-proximo">
                      Próximo: <strong>{rank.proximo}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo: Prestígios End Game */}
      {abaProgresso === 'prestigios' && (
        <div className="prestigios-grid-wrapper">
          <div className="prestigios-grid">
            {prestigiosEndGame.map((prest) => (
              <div key={prest.id} className="prestigio-card">
                <div className="prestigio-icone-box">
                  <McIcon name={prest.mcIcon} size={48} />
                </div>

                <h3 style={{ color: prest.tagCor }}>{prest.nome}</h3>
                <span className="prestigio-tag" style={{ borderColor: prest.tagCor, color: prest.tagCor }}>
                  {prest.tag}
                </span>

                <div className="prestigio-buffs-box">
                  <div className="buff-pill multiplicador">
                    <McIcon name="Gold_Ingot" size={18} />
                    <span>{prest.multiplicador}</span>
                  </div>
                  <div className="buff-pill sorte">
                    <McIcon name="Ender_Chest" size={18} />
                    <span>{prest.sorteCaixas}</span>
                  </div>
                </div>

                <div className="prestigio-custo-row">
                  <span>Custo de Aquisição:</span>
                  <strong>{prest.custo}</strong>
                </div>

                <p className="prestigio-desc">{prest.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
