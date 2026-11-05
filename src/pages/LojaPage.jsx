import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/useCart';
import { useSound } from '../context/SoundContext';
import AnimatedTabs from '../components/ui/AnimatedTabs';
import McIcon from '../components/McIcon';
import './LojaPage.css';

export default function LojaPage() {
  const { adicionarAoCarrinho, totalItens, totalFinal } = useCart();
  const { tocarXP, tocarClique } = useSound();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('todos');

  const planosVip = [
    {
      id: 1,
      nome: 'VIP Ouro',
      tag: '[Ouro]',
      preco: 'R$ 19,90',
      valor: 19.9,
      destaque: false,
      mcIcon: 'Gold_Ingot',
      descricao: 'Ideal para quem está começando e quer acelerar a mineração e a economia inicial.',
      beneficios: [
        'Tag Exclusiva [Ouro] no chat e tab',
        'Kit Semanal VIP Ouro com armadura completa',
        'Acesso à Mina VIP Básica (minérios rápidos)',
        'Sem fila de espera para login no servidor',
        '+10% de Bônus em todas as vendas no /loja',
        'Comando /reparar básico (1x a cada 6h)',
        '3 Lotes de terrenos adicionais protegidos',
        'Canal VIP exclusivo na nossa comunidade'
      ]
    },
    {
      id: 2,
      nome: 'VIP Esmeralda',
      tag: '[Esmeralda]',
      preco: 'R$ 39,90',
      valor: 39.9,
      destaque: true,
      mcIcon: 'Emerald',
      descricao: 'O plano mais equilibrado e popular, com comando /fly liberado e boost expressivo de vendas.',
      beneficios: [
        'Tag Exclusiva [Esmeralda] com cor diferenciada',
        'Kit Diário e Semanal VIP+ com ferramentas P4',
        'Acesso à Mina VIP Épica (diamantes e esmeraldas)',
        'Comando /fly liberado nos lobbys e terrenos',
        'Prioridade alta na fila de espera do servidor',
        '+25% de Bônus na economia in-game',
        'Comando /reparar ilimitado (sem custo)',
        '5 Lotes de terrenos com proteção anti-griefing',
        'Acesso à sala VIP exclusiva com eventos privados'
      ]
    },
    {
      id: 3,
      nome: 'VIP Supremo',
      tag: '[Supremo]',
      preco: 'R$ 69,90',
      valor: 69.9,
      destaque: false,
      mcIcon: 'Nether_Star',
      descricao: 'Poder máximo na TW Network. Todos os kits liberados, minas exclusivas e maior multiplicador.',
      beneficios: [
        'Tag Exclusiva [Supremo] com efeito de brilho',
        'Todos os Kits do servidor liberados permanentemente',
        'Acesso irrestrito a todas as Minas VIPs',
        'Comando /fly liberado em todas as áreas permitidas',
        'Entrada garantida mesmo com o servidor 100% lotado',
        '+50% de Bônus máximo em todas as vendas',
        'Comandos /reparar e /craft ilimitados no chat',
        '10 Lotes de terrenos para construir megabases',
        '1x Chave Suprema bônus por semana no correio'
      ]
    }
  ];

  const comparativoRecursos = [
    { recurso: 'Tag Exclusiva no Chat & Tab', ouro: 'Ouro', esmeralda: 'Esmeralda', supremo: 'Supremo ✨' },
    { recurso: 'Kits Periódicos', ouro: 'Semanal', esmeralda: 'Diário + Semanal', supremo: 'Todos Liberados' },
    { recurso: 'Acesso às Minas VIPs', ouro: 'Mina Básica', esmeralda: 'Mina Básica & Épica', supremo: 'Todas (Suprema Inclusa)' },
    { recurso: 'Comando /fly (Voar)', ouro: 'Não', esmeralda: 'Lobbys e Terrenos', supremo: 'Global Permitido' },
    { recurso: 'Bônus de Venda na Economia', ouro: '+10%', esmeralda: '+25%', supremo: '+50% (Máximo)' },
    { recurso: 'Comando /reparar Grátis', ouro: 'A cada 6 horas', esmeralda: 'Ilimitado', supremo: 'Ilimitado (/reparar tudo)' },
    { recurso: 'Entrada com Servidor Lotado', ouro: 'Fila Rápida', esmeralda: 'Prioridade Alta', supremo: 'Acesso Imediato 100%' },
    { recurso: 'Terrenos Protegidos', ouro: '3 Lotes', esmeralda: '5 Lotes', supremo: '10 Lotes' },
    { recurso: 'Slots de Leilão no /ah', ouro: '3 Slots', esmeralda: '6 Slots', supremo: '12 Slots' },
    { recurso: 'Chave Suprema Bônus', ouro: 'Não', esmeralda: '1x Inicial', supremo: '1x Toda Semana' }
  ];

  const pacotesCash = [
    {
      id: 101,
      nome: '5.000 Cash',
      preco: 'R$ 10,00',
      mcIcon: 'Gold_Ingot',
      bonus: null,
      descricao: 'Saldo essencial para pequenas compras, encantamentos rápidos e trocas in-game.'
    },
    {
      id: 102,
      nome: '15.000 Cash (+2.000 Bônus)',
      preco: 'R$ 25,00',
      mcIcon: 'Diamond',
      bonus: '+15% Bônus',
      descricao: 'Pacote mais vendido. Ideal para impulsionar suas construções e maquinários.'
    },
    {
      id: 103,
      nome: '40.000 Cash (+10.000 Bônus)',
      preco: 'R$ 50,00',
      mcIcon: 'Nether_Star',
      bonus: '+25% Bônus',
      descricao: 'Quantidade colossal para dominar o topo do ranking de fortuna da temporada.'
    }
  ];

  const pacotesChaves = [
    {
      id: 201,
      nome: '3x Chaves Épicas',
      preco: 'R$ 12,00',
      mcIcon: 'Tripwire_Hook',
      bonus: null,
      descricao: 'Abra a Caixa Épica no spawn para obter armaduras reforçadas e ferramentas P4.'
    },
    {
      id: 202,
      nome: '5x Chaves Supremas',
      preco: 'R$ 22,00',
      mcIcon: 'Amethyst_Shard',
      bonus: 'Mais Procurado',
      descricao: 'Possibilidade elevada de obter itens lendários, espadas com sharpness especial e boosters.'
    },
    {
      id: 203,
      nome: 'Combo Caixa Misteriosa (10 Chaves)',
      preco: 'R$ 39,90',
      mcIcon: 'Ender_Chest',
      bonus: 'Melhor Valor',
      descricao: 'Pacote completo com 5 Chaves Épicas + 5 Chaves Supremas para acelerar seu clã.'
    }
  ];

  const comprarDireto = (item) => {
    tocarClique();
    adicionarAoCarrinho(item);
    navigate('/checkout');
  };

  const handleAdicionar = (item) => {
    tocarXP();
    adicionarAoCarrinho(item);
  };

  const tabsLoja = [
    { id: 'todos', label: 'Todos os Produtos', icon: <McIcon name="Chest" size={18} /> },
    { id: 'vips', label: 'Planos VIP', icon: <McIcon name="Nether_Star" size={18} /> },
    { id: 'comparativo', label: 'Comparativo de Benefícios', icon: <McIcon name="Enchanted_Book" size={18} /> },
    { id: 'cash', label: 'Pacotes de Cash', icon: <McIcon name="Gold_Ingot" size={18} /> },
    { id: 'chaves', label: 'Chaves & Caixas', icon: <McIcon name="Tripwire_Hook" size={18} /> }
  ];

  return (
    <div className="loja-page-container">
      {/* Banner Principal da Loja */}
      <section className="loja-hero-banner">
        <h1>Loja Oficial &amp; Patentes VIP</h1>
        <p>
          Adquira planos VIP, saldo em Cash e chaves misteriosas para impulsionar seu progresso.
          Todos os pedidos contam com entrega automatizada em menos de 1 minuto via Pix e Cartão de Crédito.
        </p>

        <div className="loja-vantagens-rapidas">
          <div className="vantagem-chip">
            <McIcon name="Emerald" size={18} />
            <span>Ativação Imediata via Pix</span>
          </div>
          <div className="vantagem-chip">
            <McIcon name="Totem_Of_Undying" size={18} />
            <span>Garantia &amp; Suporte Dedicado</span>
          </div>
          <div className="vantagem-chip">
            <McIcon name="Gold_Nugget" size={18} />
            <span>Bônus Cumulativos de Economia</span>
          </div>
        </div>
      </section>

      {/* Menu de Abas da Loja com Framer Motion */}
      <div className="loja-tabs-wrapper">
        <AnimatedTabs
          tabs={tabsLoja}
          activeTab={abaAtiva}
          onChange={(novaAba) => {
            tocarClique();
            setAbaAtiva(novaAba);
          }}
          layoutId="lojaTabsIndicator"
        />
      </div>

      {/* Seção de Planos VIP */}
      {(abaAtiva === 'todos' || abaAtiva === 'vips') && (
        <section id="secao-vips" className="loja-secao">
          <div className="loja-secao-header">
            <h2>Planos VIP da Temporada</h2>
            <p>Vantagens contínuas para acelerar o seu RankUP com comandos exclusivos, kits e bônus de venda.</p>
          </div>

          <div className="vips-grid">
            {planosVip.map((vip) => (
              <div key={vip.id} className={`vip-card-loja ${vip.destaque ? 'destaque' : ''}`}>
                {vip.destaque && <span className="vip-badge-tag">Mais Escolhido</span>}
                
                <div className="vip-icone-topo">
                  <McIcon name={vip.mcIcon} size={48} />
                </div>

                <h3>{vip.nome}</h3>
                <span className="vip-tag-jogo">{vip.tag}</span>

                <div className="vip-preco-box">
                  <span className="vip-preco-valor">{vip.preco}</span>
                  <span className="vip-preco-ciclo"> /mês</span>
                </div>

                <p className="vip-card-desc">{vip.descricao}</p>

                <ul className="vip-lista-vantagens">
                  {vip.beneficios.map((b, idx) => (
                    <li key={idx}>
                      <Check size={16} className="text-emerald-400 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="vip-acoes-card">
                  <button
                    type="button"
                    className="btn-comprar-agora"
                    onClick={() => comprarDireto(vip)}
                  >
                    <McIcon name="Emerald" size={16} />
                    <span>Comprar Agora</span>
                  </button>
                  <button
                    type="button"
                    className="btn-add-carrinho"
                    onClick={() => handleAdicionar(vip)}
                  >
                    <McIcon name="Chest" size={16} />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tabela Comparativa de VIPs */}
      {(abaAtiva === 'todos' || abaAtiva === 'comparativo' || abaAtiva === 'vips') && (
        <section className="comparativo-wrapper">
          <div className="comparativo-header">
            <h3>Comparativo Completo de Recursos</h3>
            <p>Confira em detalhes o que cada plano VIP desbloqueia para o seu jogador.</p>
          </div>

          <div className="tabela-overflow">
            <table className="tabela-comparativa">
              <thead>
                <tr>
                  <th>Vantagem / Recurso</th>
                  <th>VIP Ouro</th>
                  <th className="col-vip-destaque">VIP Esmeralda (Recomendado)</th>
                  <th>VIP Supremo</th>
                </tr>
              </thead>
              <tbody>
                {comparativoRecursos.map((item, index) => (
                  <tr key={index}>
                    <td className="col-recurso">{item.recurso}</td>
                    <td>{item.ouro}</td>
                    <td className="destaque-col">
                      <strong>{item.esmeralda}</strong>
                    </td>
                    <td>
                      <span className="font-bold text-amber-400">
                        {item.supremo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Seção de Cash */}
      {(abaAtiva === 'todos' || abaAtiva === 'cash') && (
        <section id="secao-cash" className="loja-secao">
          <div className="loja-secao-header">
            <h2>Pacotes de Moedas Cash</h2>
            <p>Moeda premium para comprar lotes adicionais, itens de conveniência e chaves na praça in-game.</p>
          </div>

          <div className="itens-shop-grid">
            {pacotesCash.map((item) => (
              <div key={item.id} className="item-shop-card">
                {item.bonus && <span className="item-shop-badge">{item.bonus}</span>}
                
                <div className="item-shop-icon-box">
                  <McIcon name={item.mcIcon} size={42} />
                </div>

                <h3 className="item-shop-nome">{item.nome}</h3>
                <p className="item-shop-desc">{item.descricao}</p>
                <div className="item-shop-preco">{item.preco}</div>

                <div className="vip-acoes-card">
                  <button
                    type="button"
                    className="btn-comprar-agora"
                    onClick={() => comprarDireto(item)}
                  >
                    <McIcon name="Emerald" size={16} />
                    <span>Comprar Direto</span>
                  </button>
                  <button
                    type="button"
                    className="btn-add-carrinho"
                    onClick={() => handleAdicionar(item)}
                  >
                    <McIcon name="Chest" size={16} />
                    <span>Carrinho</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Seção de Chaves e Caixas */}
      {(abaAtiva === 'todos' || abaAtiva === 'chaves') && (
        <section id="secao-chaves" className="loja-secao">
          <div className="loja-secao-header">
            <h2>Chaves &amp; Caixas Misteriosas</h2>
            <p>Abra caixas mágicas na praça central do spawn e conquiste equipamentos épicos e relíquias de guerra.</p>
          </div>

          <div className="itens-shop-grid">
            {pacotesChaves.map((item) => (
              <div key={item.id} className="item-shop-card">
                {item.bonus && <span className="item-shop-badge">{item.bonus}</span>}
                
                <div className="item-shop-icon-box">
                  <McIcon name={item.mcIcon} size={42} />
                </div>

                <h3 className="item-shop-nome">{item.nome}</h3>
                <p className="item-shop-desc">{item.descricao}</p>
                <div className="item-shop-preco">{item.preco}</div>

                <div className="vip-acoes-card">
                  <button
                    type="button"
                    className="btn-comprar-agora"
                    onClick={() => comprarDireto(item)}
                  >
                    <McIcon name="Emerald" size={16} />
                    <span>Comprar Direto</span>
                  </button>
                  <button
                    type="button"
                    className="btn-add-carrinho"
                    onClick={() => handleAdicionar(item)}
                  >
                    <McIcon name="Chest" size={16} />
                    <span>Carrinho</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Barra Flutuante de Carrinho se houver itens */}
      {totalItens > 0 && (
        <div className="barra-carrinho-flutuante">
          <div className="barra-carrinho-info">
            <McIcon name="Chest" size={22} />
            <span>
              <strong>{totalItens} {totalItens === 1 ? 'item' : 'itens'}</strong> no carrinho • Total: <strong>R$ {totalFinal.toFixed(2).replace('.', ',')}</strong>
            </span>
          </div>
          <Link to="/carrinho" className="barra-carrinho-btn">
            <span>Ver Carrinho &amp; Finalizar</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
