import React from 'react';
import { Link } from 'react-router-dom';
import './VipShowcase.css';
import McIcon from './McIcon';

export default function VipShowcase() {
  const destaques = [
    {
      nome: 'VIP Ouro',
      preco: 'R$ 19,90',
      icone: 'Gold_Ingot',
      vantagem: 'Mina Básica & Tag [Ouro]',
      bonus: '+10% Vendas'
    },
    {
      nome: 'VIP Esmeralda',
      preco: 'R$ 39,90',
      icone: 'Emerald',
      vantagem: 'Comando /fly & Kit P4',
      bonus: '+25% Vendas',
      maisEscolhido: true
    },
    {
      nome: 'VIP Supremo',
      preco: 'R$ 69,90',
      icone: 'Nether_Star',
      vantagem: 'Todos os Kits & Minas',
      bonus: '+50% Vendas'
    }
  ];

  return (
    <section className="vip-showcase-section">
      <div className="vip-showcase-card">
        <div className="vip-showcase-header">
          <span className="vip-showcase-badge">
            <McIcon name="Emerald" size={16} />
            Economia & Patentes VIP
          </span>
          <h2>Acelere sua Evolução no <span className="highlight">RankUP</span></h2>
          <p>
            Obtenha comando <code>/fly</code>, multiplicadores acumulativos de economia, acesso a minas com regeneração acelerada e kits periódicos exclusivos.
          </p>
        </div>

        <div className="vip-showcase-grid">
          {destaques.map((item, idx) => (
            <div key={idx} className={`showcase-mini-card ${item.maisEscolhido ? 'destaque mc-enchanted-glint' : ''}`}>
              {item.maisEscolhido && <span className="mini-card-badge">Mais Popular</span>}
              <div className="mini-card-icon">
                <McIcon name={item.icone} size={36} />
              </div>
              <h4>{item.nome}</h4>
              <span className="mini-card-vantagem">{item.vantagem}</span>
              <span className="mini-card-bonus">{item.bonus}</span>
              <div className="mini-card-preco">{item.preco} <span>/mês</span></div>
            </div>
          ))}
        </div>

        <div className="vip-showcase-footer">
          <Link to="/loja" className="btn-showcase-loja">
            <McIcon name="Chest" size={20} />
            Explorar Loja Completa & Comparativo VIP
          </Link>
          <span className="showcase-aviso-seguro">
            <McIcon name="Shield" size={16} />
            Ativação 100% Automática via Pix e Cartão de Crédito
          </span>
        </div>
      </div>
    </section>
  );
}
