import React from 'react';
import McIcon from './McIcon';
import './Features.css';

export default function Features() {
  const recursos = [
    {
      id: 1,
      mcIcon: "Diamond_Pickaxe",
      titulo: "RankUP Balanceado",
      accent: "emerald",
      descricao: "Progressão meritocrática com minas dinâmicas, fórmulas de venda justas e sem pay-to-win abusivo."
    },
    {
      id: 2,
      mcIcon: "Gold_Ingot",
      titulo: "Economia Real",
      accent: "gold",
      descricao: "Mercado livre entre jogadores, leilões globais (/ah) e valorização orgânica de itens raros."
    },
    {
      id: 3,
      mcIcon: "Totem_Of_Undying",
      titulo: "Premiações via Pix",
      accent: "ice",
      descricao: "Os maiores magnatas da temporada recebem transferências bancárias reais no Pix semanalmente."
    },
    {
      id: 4,
      mcIcon: "Diamond_Sword",
      titulo: "Arenas & Gladiador",
      accent: "red",
      descricao: "Eventos automáticos, combates com suporte a 1.8 e 1.20 sem atraso de registro de dano."
    }
  ];

  return (
    <section id="recursos" className="features-container">
      <div className="features-header">
        <h2>Diferenciais construídos para durar</h2>
        <p>Desenvolvido por quem joga e entende de comunidade. Um ecossistema estável para o seu progresso diário.</p>
      </div>

      <div className="features-grid">
        {recursos.map((item) => (
          <div key={item.id} className={`feature-card feature-accent-${item.accent}`}>
            <div className="feature-icon">
              <McIcon name={item.mcIcon} size={36} />
            </div>
            <h3 className="feature-title">{item.titulo}</h3>
            <p className="feature-desc">{item.descricao}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
