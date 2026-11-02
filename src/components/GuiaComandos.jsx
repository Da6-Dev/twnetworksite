import React, { useState } from 'react';
import './GuiaComandos.css';
import McIcon from './McIcon';

export default function GuiaComandos() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('geral');
  const [comandoCopiado, setComandoCopiado] = useState(null);

  const categorias = [
    { id: 'geral', nome: 'Geral & Progresso', mcIcon: 'Compass' },
    { id: 'economia', nome: 'Economia & Vendas', mcIcon: 'Gold_Ingot' },
    { id: 'terrenos', nome: 'Terrenos & Proteção', mcIcon: 'Grass_Block' },
    { id: 'vips', nome: 'Vantagens VIP', mcIcon: 'Nether_Star' }
  ];

  const comandosPorCategoria = {
    geral: [
      { comando: '/rankup', descricao: 'Avança para o próximo nível assim que você atingir os requisitos.' },
      { comando: '/ranks', descricao: 'Exibe a lista de todos os níveis disponíveis e seus respectivos custos.' },
      { comando: '/mina', descricao: 'Teletransporta você para a área de mineração adequada ao seu rank atual.' },
      { comando: '/spawn', descricao: 'Retorna ao ponto central seguro da rede TW Network.' },
      { comando: '/regras', descricao: 'Exibe as normas e diretrizes de conduta do servidor.' }
    ],
    economia: [
      { comando: '/money', descricao: 'Consulta o saldo atual da sua carteira in-game.' },
      { comando: '/pay [jogador] [quantia]', descricao: 'Transfere moedas para a conta de outro jogador.' },
      { comando: '/loja', descricao: 'Abre o mercado global in-game para compra e venda de recursos.' },
      { comando: '/leilao', descricao: 'Permite participar ou abrir licitações de itens raros (/ah).' }
    ],
    terrenos: [
      { comando: '/terreno comprar', descricao: 'Adquire o lote de terreno onde você se encontra.' },
      { comando: '/terreno convidar [jogador]', descricao: 'Concede permissão para um amigo construir no seu lote.' },
      { comando: '/terreno kick [jogador]', descricao: 'Remove um jogador indesejado do seu terreno.' },
      { comando: '/terreno info', descricao: 'Exibe as dimensões, limites e membros autorizados no lote.' }
    ],
    vips: [
      { comando: '/fly', descricao: 'Ativa ou desativa a habilidade de voar nas áreas permitidas.' },
      { comando: '/reparar', descricao: 'Restaura a durabilidade de armaduras e ferramentas sem custos.' },
      { comando: '/minavip', descricao: 'Acesso imediato às minas exclusivas com taxas de minério ampliadas.' },
      { comando: '/kit vip', descricao: 'Resgata o kit periódico de recompensas do seu plano ativo.' }
    ]
  };

  const copiarComando = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setComandoCopiado(cmd);
    setTimeout(() => {
      setComandoCopiado(null);
    }, 1800);
  };

  return (
    <section id="comandos" className="guia-container">
      <div className="guia-header">
        <span className="badge-secao-comandos">
          <McIcon name="Compass" size={16} />
          Atalhos Rápidos
        </span>
        <h2>Guia de <span className="highlight">Comandos & Dicas</span></h2>
        <p>Consulte os principais atalhos in-game para acelerar a sua evolução no RankUP.</p>
      </div>

      <div className="guia-tabs">
        {categorias.map((cat) => {
          const isAtiva = categoriaAtiva === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`tab-btn ${isAtiva ? 'ativa' : ''}`}
              onClick={() => setCategoriaAtiva(cat.id)}
            >
              <McIcon name={cat.mcIcon} size={18} />
              {cat.nome}
            </button>
          );
        })}
      </div>

      <div className="comandos-lista">
        {comandosPorCategoria[categoriaAtiva].map((item, index) => (
          <div key={index} className="comando-card">
            <div className="comando-info">
              <code className="comando-codigo">{item.comando}</code>
              <p className="comando-desc">{item.descricao}</p>
            </div>
            <button
              type="button"
              className={`btn-copiar-cmd ${comandoCopiado === item.comando ? 'sucesso' : ''}`}
              onClick={() => copiarComando(item.comando)}
              title="Copiar comando"
            >
              <McIcon name={comandoCopiado === item.comando ? 'Emerald' : 'Clock'} size={14} />
              {comandoCopiado === item.comando ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}