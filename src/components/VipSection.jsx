import React from 'react';
import './VipSection.css';
import McIcon from './McIcon';

export default function VipSection({ onAdicionarAoCarrinho }) {
  const planosVip = [
    {
      id: 1,
      nome: "VIP Ouro",
      preco: "R$ 19,90",
      destaque: false,
      mcIcon: "Gold_Ingot",
      beneficios: [
        "Tag Exclusiva [Ouro]",
        "Kit Semanal VIP",
        "Acesso à Mina VIP Básica",
        "Sem tempo de espera para login",
        "+10% de Bônus na economia"
      ]
    },
    {
      id: 2,
      nome: "VIP Esmeralda",
      preco: "R$ 39,90",
      destaque: true,
      mcIcon: "Emerald",
      beneficios: [
        "Tag Exclusiva [Esmeralda]",
        "Kit Diário e Semanal VIP+",
        "Acesso à Mina VIP Épica",
        "Voar (Fly) nos lobbys",
        "Prioridade na fila",
        "+25% de Bônus na economia"
      ]
    },
    {
      id: 3,
      nome: "VIP Supremo",
      preco: "R$ 69,90",
      destaque: false,
      mcIcon: "Nether_Star",
      beneficios: [
        "Tag Exclusiva [Supremo]",
        "Todos os Kits Liberados",
        "Acesso a todas as Minas VIPs",
        "Comando /reparar grátis",
        "Canal exclusivo no Discord",
        "+50% de Bônus na economia"
      ]
    }
  ];

  return (
    <section id="loja" className="vip-container">
      <div className="vip-header">
        <h2>Escolha seu <span className="highlight">Plano VIP</span></h2>
        <p>Acelere sua evolução no RankUP e ganhe benefícios exclusivos ajudando a manter o servidor online!</p>
      </div>

      <div className="vip-cards-wrapper">
        {planosVip.map((vip) => (
          <div key={vip.id} className={`vip-card ${vip.destaque ? 'destaque' : ''}`}>
            {vip.destaque && <div className="badge-recomendado">Mais Popular</div>}
            
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0 1rem' }}>
              <McIcon name={vip.mcIcon} size={48} />
            </div>

            <h3 className="vip-nome">{vip.nome}</h3>
            <div className="vip-preco">
              <span className="moeda"></span> {vip.preco} <span className="periodo">/mês</span>
            </div>
            
            <ul className="vip-beneficios">
              {vip.beneficios.map((beneficio, index) => (
                <li key={index}>
                  <McIcon name="Emerald" size={14} style={{ marginRight: '6px', verticalAlign: '-1px' }} />
                  {beneficio}
                </li>
              ))}
            </ul>

            <button 
              className="btn-comprar"
              onClick={() => onAdicionarAoCarrinho(vip)}
            >
              Adicionar ao Carrinho
              <McIcon name="Chest" size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}