import React from 'react';
import './Features.css';
import McIcon from './McIcon';

export default function Features() {
  const recursos = [
    {
      id: 1,
      mcIcon: "Diamond_Pickaxe",
      titulo: "RankUP Evolutivo",
      descricao: "Evolua de rank ao minerar, vender recursos e cumprir objetivos exclusivos com progressão balanceada."
    },
    {
      id: 2,
      mcIcon: "Gold_Ingot",
      titulo: "Economia Própria",
      descricao: "Mercado dinâmico, leilões entre jogadores (/ah) e sistemas de valorização de itens em tempo real."
    },
    {
      id: 3,
      mcIcon: "Totem_Of_Undying",
      titulo: "Prêmios em Dinheiro Real",
      descricao: "Os melhores colocados no ranking de cada temporada recebem premiações reais pagas via Pix."
    },
    {
      id: 4,
      mcIcon: "Diamond_Sword",
      titulo: "Minijogos & Eventos",
      descricao: "Eventos diários automáticos, arenas PvP temáticas e desafios com bônus para toda a comunidade."
    }
  ];

  return (
    <section id="recursos" className="features-container">
      <div className="features-header">
        <span className="badge-secao-features">
          <McIcon name="Nether_Star" size={16} />
          Diferenciais Exclusivos
        </span>
        <h2>Por que jogar na <span className="highlight">TW Network</span>?</h2>
        <p>Um ecossistema criado do zero para proporcionar a melhor experiência de RankUP no Minecraft.</p>
      </div>

      <div className="features-grid">
        {recursos.map((item) => (
          <div key={item.id} className="feature-card">
            <div className="feature-icon">
              <McIcon name={item.mcIcon} size={44} />
            </div>
            <h3 className="feature-title">{item.titulo}</h3>
            <p className="feature-desc">{item.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}