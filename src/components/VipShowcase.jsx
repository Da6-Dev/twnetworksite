import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import McIcon from './McIcon';
import './VipShowcase.css';

export default function VipShowcase() {
  const destaques = [
    {
      nome: 'VIP Ouro',
      preco: 'R$ 19,90',
      icone: 'Gold_Ingot',
      vantagem: 'Mina Básica & Tag [Ouro]',
      bonus: '+10% em Vendas'
    },
    {
      nome: 'VIP Esmeralda',
      preco: 'R$ 39,90',
      icone: 'Emerald',
      vantagem: 'Comando /fly & Kit P4',
      bonus: '+25% em Vendas',
      maisEscolhido: true
    },
    {
      nome: 'VIP Supremo',
      preco: 'R$ 69,90',
      icone: 'Nether_Star',
      vantagem: 'Todos os Kits & Minas',
      bonus: '+50% Máximo'
    }
  ];

  return (
    <section className="vip-showcase-section">
      <div className="vip-showcase-card">
        <div className="vip-showcase-header">
          <h2>Planos VIP &amp; Impulso Econômico</h2>
          <p>
            Voe livremente com <code>/fly</code>, ative multiplicadores permanentes de venda e garanta acesso a minas de regeneração instantânea.
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
