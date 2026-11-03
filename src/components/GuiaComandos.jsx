import React, { useState } from 'react';
import { Search, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useSound } from '../context/SoundContext';
import McIcon from './McIcon';
import './GuiaComandos.css';

export default function GuiaComandos() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('geral');
  const [busca, setBusca] = useState('');
  const [comandoCopiado, setComandoCopiado] = useState(null);
  const { tocarXP } = useSound();

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
    tocarXP();
    navigator.clipboard.writeText(cmd);
    setComandoCopiado(cmd);
    toast.success(`Comando ${cmd} copiado! Cole no chat do jogo.`);
    setTimeout(() => {
      setComandoCopiado(null);
    }, 1800);
  };

  // Filtragem inteligente por busca
  const comandosFiltrados = comandosPorCategoria[categoriaAtiva].filter((c) => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase();
    return c.comando.toLowerCase().includes(termo) || c.descricao.toLowerCase().includes(termo);
  });

  return (
    <section id="comandos" className="guia-container">
      <div className="guia-header">
        <h2>Atalhos &amp; Comandos Essenciais</h2>
        <p>Consulte todos os atalhos disponíveis no jogo com cópia rápida para agilizar sua jogatina.</p>
      </div>

      {/* Barra de Busca de Comandos */}
      <div className="guia-busca-wrapper">
        <Search size={18} className="guia-busca-icon" />
        <input
          type="text"
          placeholder="Pesquisar comando (ex: /rankup, /fly, /loja)..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="guia-busca-input"
        />
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
              <span>{cat.nome}</span>
            </button>
          );
        })}
      </div>

      <div className="comandos-lista">
        {comandosFiltrados.length === 0 ? (
          <div className="comandos-vazio">
            <p>Nenhum comando encontrado para o termo pesquisado.</p>
          </div>
        ) : (
          comandosFiltrados.map((item, index) => {
            const isCopiado = comandoCopiado === item.comando;
            return (
              <div key={index} className="comando-card">
                <div className="comando-info">
                  <div className="comando-code-row">
                    <code>{item.comando}</code>
                  </div>
                  <p>{item.descricao}</p>
                </div>
                <button
                  type="button"
                  className={`btn-copiar-cmd ${isCopiado ? 'copiado' : ''}`}
                  onClick={() => copiarComando(item.comando)}
                  title="Copiar comando"
                >
                  {isCopiado ? <Check size={16} /> : <Copy size={16} />}
                  <span>{isCopiado ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
