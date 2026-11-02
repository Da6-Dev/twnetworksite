import React, { useState } from 'react';
import './CashShop.css';
import McIcon from './McIcon';

export default function CashShop({ onAdicionarAoCarrinho }) {
  const [categoria, setCategoria] = useState('cash');

  const pacotesCash = [
    {
      id: 101,
      nome: '5.000 Cash',
      preco: 'R$ 10,00',
      mcIcon: 'Gold_Ingot',
      bonus: null,
      descricao: 'Ideal para pequenas compras e itens essenciais no mercado in-game.'
    },
    {
      id: 102,
      nome: '15.000 Cash (+2.000 Bônus)',
      preco: 'R$ 25,00',
      mcIcon: 'Diamond',
      bonus: '+15% Bônus',
      descricao: 'Pacote mais popular para impulsionar construções e trocas comerciais.'
    },
    {
      id: 103,
      nome: '40.000 Cash (+10.000 Bônus)',
      preco: 'R$ 50,00',
      mcIcon: 'Nether_Star',
      bonus: '+25% Bônus',
      descricao: 'Quantidade recomendada para quem quer dominar o topo do ranking econômico.'
    }
  ];

  const pacotesChaves = [
    {
      id: 201,
      nome: '3x Chaves Épicas',
      preco: 'R$ 12,00',
      mcIcon: 'Tripwire_Hook',
      bonus: null,
      descricao: 'Abra caixas especiais no spawn para receber armaduras e ferramentas raras.'
    },
    {
      id: 202,
      nome: '5x Chaves Supremas',
      preco: 'R$ 22,00',
      mcIcon: 'Amethyst_Shard',
      bonus: 'Mais Vendido',
      descricao: 'Possibilidade elevada de obter itens lendários e encantamentos únicos.'
    },
    {
      id: 203,
      nome: 'Combo Caixa Misteriosa (10 Chaves)',
      preco: 'R$ 39,90',
      mcIcon: 'Ender_Chest',
      bonus: 'Melhor Valor',
      descricao: 'Conjunto completo de chaves para abrir em grupo ou armazenar para eventos.'
    }
  ];

  const itensAtuais = categoria === 'cash' ? pacotesCash : pacotesChaves;

  return (
    <section id="cash" className="cash-section">
      <div className="cash-header">
        <span className="badge-secao-cash">
          <McIcon name="Diamond" size={16} />
          Economia & Recompensas
        </span>
        <h2>Cash & <span className="highlight">Itens Especiais</span></h2>
        <p>Adquira saldo para utilizar na loja in-game ou desbloqueie chaves de caixas misteriosas.</p>
      </div>

      <div className="cash-tabs">
        <button
          className={`tab-filtro ${categoria === 'cash' ? 'ativo' : ''}`}
          onClick={() => setCategoria('cash')}
        >
          <McIcon name="Diamond" size={18} style={{ marginRight: '6px' }} />
          Pacotes de Cash
        </button>
        <button
          className={`tab-filtro ${categoria === 'chaves' ? 'ativo' : ''}`}
          onClick={() => setCategoria('chaves')}
        >
          <McIcon name="Tripwire_Hook" size={18} style={{ marginRight: '6px' }} />
          Chaves & Caixas
        </button>
      </div>

      <div className="cash-grid">
        {itensAtuais.map((item) => (
          <div key={item.id} className="cash-card">
            {item.bonus && <div className="cash-badge">{item.bonus}</div>}
            
            <div className="cash-card-icon">
              <McIcon name={item.mcIcon} size={48} />
            </div>
            <h3 className="cash-card-nome">{item.nome}</h3>
            <p className="cash-card-desc">{item.descricao}</p>
            
            <div className="cash-card-preco">{item.preco}</div>

            <button
              className="btn-adicionar-cash"
              onClick={() => onAdicionarAoCarrinho(item)}
            >
              Adicionar ao Carrinho
              <McIcon name="Chest" size={16} style={{ marginLeft: '6px' }} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}