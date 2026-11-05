import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import McIcon from './McIcon';
import './VipShowcase.css';

export default function VipShowcase() {
  const destaques = [
    {
      nome: 'VIP Festivo',
      preco: 'R$ 19,90',
      icone: 'Gold_Ingot',
      vantagem: 'Mina Festivo & Chat /vc',
      bonus: '+25% Multiplicador'
    },
    {
      nome: 'VIP Nevasca',
      preco: 'R$ 39,90',
      icone: 'Emerald',
      vantagem: 'Mina Nevasca, /fly & /reparar',
      bonus: '+50% Multiplicador',
      maisEscolhido: true
    },
    {
      nome: 'VIP Polar',
      preco: 'R$ 69,90',
      icone: 'Nether_Star',
      vantagem: 'Mina Polar (Ancient Debris)',
      bonus: '+100% (2.0x Dobro)'
    }
  ];

  return (
    <section className="vip-showcase-section">
      <div className="vip-showcase-card">
        <div className="vip-showcase-header">
          <h2>Planos VIP &amp; Impulso Econômico</h2>
          <p>
            Voe livremente com <code>/fly</code>, acerte negociações no canal <code>/vc</code>, ative multiplicadores de venda até <strong>2.0x</strong> e acesse as 3 Minas VIPs exclusivas.
          </p>
        </div>

        <div className="vip-showcase-grid">
          {destaques.map((item, idx) => (
            <div key={idx} className={`showcase-mini-card ${item.maisEscolhido ? 'destaque' : ''}`}>
              {item.maisEscolhido && <span className="mini-card-badge">Mais Escolhido</span>}
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
            <McIcon name="Nether_Star" size={20} />
            <span>Ver Todos os Planos &amp; Comparativo</span>
            <ArrowRight size={18} />
          </Link>
          <span className="showcase-aviso-seguro">
            <McIcon name="Emerald" size={18} />
            <span>Ativação automatizada em menos de 1 minuto via Pix e Cartão</span>
          </span>
        </div>
      </div>
    </section>
  );
}
