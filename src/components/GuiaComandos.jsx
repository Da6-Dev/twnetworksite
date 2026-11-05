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
    { id: 'progresso', nome: 'Ranks & Prestígios', mcIcon: 'Totem_Of_Undying' },
    { id: 'mineracao', nome: 'Minas & PvP', mcIcon: 'Diamond_Pickaxe' },
    { id: 'industria', nome: 'Indústria & Plots', mcIcon: 'Grass_Block' },
    { id: 'economia', nome: 'Economia & Correio', mcIcon: 'Gold_Ingot' },
    { id: 'vips', nome: 'Comandos VIP', mcIcon: 'Nether_Star' }
  ];

  const comandosPorCategoria = {
    progresso: [
      { comando: '/rankup', descricao: 'Avança para o próximo rank natalino assim que você acumular o saldo necessário.' },
      { comando: '/rankupmax', descricao: 'Consome todo o seu saldo disponível para subir o maior número possível de ranks de uma só vez.' },
      { comando: '/ranks', descricao: 'Exibe a lista com os 11 Ranks Natalinos, custos de evolução e vantagens.' },
      { comando: '/prestigio', descricao: 'Abre o menu de prestígios (Grinch, Yeti e Krampus) para reiniciar o progresso com multiplicadores.' },
      { comando: '/menu', descricao: 'Abre o menu central de navegação rápida com todas as áreas e funcionalidades.' },
      { comando: '/spawn', descricao: 'Retorna ao lobby central seguro do servidor no mundo world.' }
    ],
    mineracao: [
      { comando: '/mina', descricao: 'Abre a interface ou teletransporta você para a área de mineração correspondente ao seu rank.' },
      { comando: '/minaslista', descricao: 'Lista todas as minas do servidor, incluindo minas públicas e minas VIPs.' },
      { comando: '/minapvp', descricao: 'Teleporta para a zona segura da mina PvP com minérios valiosos e extração arriscada.' },
      { comando: '/pvpsair', descricao: 'Sai com segurança da arena da mina PvP caso você não esteja marcado em combate.' }
    ],
    industria: [
      { comando: '/terreno', descricao: 'Gerencia seus lotes industriais de 42x42 no mundo terrenos (novo plot por R$ 50.000).' },
      { comando: '/maquinas', descricao: 'Abre o painel de máquinas industriais de Carvão a Noel para abastecimento e coleta.' },
      { comando: '/maquinas status', descricao: 'Exibe estatísticas de rendimento monetário por segundo e nível de combustível.' },
      { comando: '/spawners', descricao: 'Painel de controle e melhorias de velocidade/loot dos geradores de monstros.' },
      { comando: '/farms', descricao: 'Acessa o painel de silos agrícolas, colheitas automáticas e fertilizantes alquímicos.' },
      { comando: '/caixas', descricao: 'Central de Caixas Misteriosas: visualize suas chaves, forja e progresso do Pity System.' }
    ],
    economia: [
      { comando: '/money', descricao: 'Consulta o saldo atual da sua carteira in-game.' },
      { comando: '/pay [jogador] [quantia]', descricao: 'Transfere moedas com segurança para outro jogador online.' },
      { comando: '/baltop', descricao: 'Exibe os jogadores mais ricos do servidor disputando a premiação da temporada.' },
      { comando: '/cheque [quantia]', descricao: 'Converte seu saldo em um cheque físico que pode ser guardado ou negociado.' },
      { comando: '/correio', descricao: 'Abre sua caixa postal virtual para resgatar diamantes, esmeraldas de ranks e compras da loja.' }
    ],
    vips: [
      { comando: '/vc [mensagem]', descricao: 'Canal de comunicação exclusivo e privado para jogadores com plano VIP ativo.' },
      { comando: '/fly', descricao: 'Ativa ou desativa a habilidade de voar nas regiões e mundos autorizados.' },
      { comando: '/reparar [all]', descricao: 'Restaura a durabilidade de armaduras e picaretas instantaneamente sem custos.' },
      { comando: '/feed', descricao: 'Restaura a barra de saturação e fome imediatamente sem necessidade de alimentos.' },
      { comando: '/hat', descricao: 'Equipa qualquer bloco decorativo na cabeça como acessório estético exclusivo.' },
      { comando: '/kit vip', descricao: 'Resgata o kit periódico com armaduras reforçadas e ferramentas da sua categoria VIP.' }
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
