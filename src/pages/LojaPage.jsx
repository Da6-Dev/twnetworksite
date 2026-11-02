import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useSound } from '../context/SoundContext';
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
        'Acesso à Mina VIP Básica (minérios + rápidos)',
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
      descricao: 'O plano mais equilibrado e popular, com comando /fly e boost significativo de vendas.',
      beneficios: [
        'Tag Exclusiva [Esmeralda] com cor diferenciada',
        'Kit Diário e Semanal VIP+ com ferramentas P4',
        'Acesso à Mina VIP Épica (com diamantes e esmeraldas)',
        'Comando /fly liberado nos lobbys e no seu terreno',
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
        'Acesso irrestrito a todas as Minas VIPs (Suprema)',
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

  return (
    <div className="loja-page-container">
      {/* Banner Principal da Loja */}
      <section className="loja-hero-banner">
        <span className="loja-tag-topo">
          <McIcon name="Nether_Star" size={16} style={{ marginRight: '6px' }} />
          Loja Oficial • TW Network
        </span>
        <h1>Loja Oficial & Planos <span className="highlight">VIP</span></h1>
        <p>
          Adquira planos VIP, moedas de Cash e chaves misteriosas para impulsionar o seu progresso no servidor.
          Todos os pedidos contam com entrega automatizada instantânea via Pix e cartão!
        </p>

        <div className="loja-vantagens-rapidas">
          <div className="vantagem-chip">
            <McIcon name="Redstone" size={18} />
            Ativação Automática via Pix
          </div>
          <div className="vantagem-chip">
            <McIcon name="Emerald" size={18} />
            Suporte Prioritário 24/7
          </div>
          <div className="vantagem-chip">
            <McIcon name="Gold_Ingot" size={18} />
            Bônus de Economia Acumulativo
          </div>
        </div>
      </section>

      {/* Menu de Abas da Loja */}
      <div className="loja-nav-tabs">
        <button
          className={`loja-tab-btn ${abaAtiva === 'todos' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('todos')}
        >
          <McIcon name="Chest" size={18} />
          Todos os Produtos
        </button>
        <button
          className={`loja-tab-btn ${abaAtiva === 'vips' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('vips')}
        >
          <McIcon name="Emerald" size={18} />
          Planos VIP
        </button>
        <button
          className={`loja-tab-btn ${abaAtiva === 'comparativo' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('comparativo')}
        >
          <McIcon name="Book" size={18} />
          Comparativo de VIPs
        </button>
        <button
          className={`loja-tab-btn ${abaAtiva === 'cash' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('cash')}
        >
          <McIcon name="Gold_Ingot" size={18} />
          Pacotes de Cash
        </button>
        <button
          className={`loja-tab-btn ${abaAtiva === 'chaves' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('chaves')}
        >
          <McIcon name="Tripwire_Hook" size={18} />
          Chaves & Caixas
        </button>
      </div>

      {/* Seção de Planos VIP */}
      {(abaAtiva === 'todos' || abaAtiva === 'vips') && (
        <section id="secao-vips" className="loja-secao">
          <div className="loja-secao-header">
            <h2>Escolha o seu <span className="highlight">Plano VIP</span></h2>
            <p>Os planos VIP oferecem multiplicadores de economia, kits raros e comando /fly para acelerar o seu RankUP.</p>
          </div>

          <div className="vips-grid">
            {planosVip.map((vip) => (
              <div key={vip.id} className={`vip-card-loja ${vip.destaque ? 'destaque mc-enchanted-glint' : ''}`}>
                {vip.destaque && <span className="vip-badge-tag">Mais Escolhido</span>}
                
                <div className="vip-icone-topo">
                  <McIcon name={vip.mcIcon} size={48} />
                </div>

                <h3>{vip.nome}</h3>
                <span className="vip-tag-jogo">{vip.tag}</span>

                <div className="vip-preco-box">
                  <span className="vip-preco-valor">{vip.preco}</span>
                  <span className="vip-preco-ciclo"> /mensal</span>
                </div>

                <ul className="vip-lista-vantagens">
                  {vip.beneficios.map((b, idx) => (
                    <li key={idx}>
                      <McIcon name="Emerald" size={14} />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="vip-acoes-card">
                  <button
                    className="btn-comprar-agora"
                    onClick={() => comprarDireto(vip)}
                  >
                    Comprar Agora
                    <McIcon name="Redstone" size={16} />
                  </button>
                  <button
                    className="btn-add-carrinho"
                    onClick={() => handleAdicionar(vip)}
                  >
                    Adicionar ao Carrinho
                    <McIcon name="Chest" size={16} />
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
            <span className="badge-temporada" style={{ marginBottom: '8px', display: 'inline-block' }}>
              Transparência & Benefícios
            </span>
            <h3>Comparativo Completo de <span className="highlight">Planos VIP</span></h3>
            <p>Veja detalhadamente tudo o que cada patente desbloqueia dentro dos servidores da TW Network.</p>
          </div>

          <div className="tabela-overflow">
            <table className="tabela-comparativa">
              <thead>
                <tr>
                  <th>Vantagem / Recurso</th>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <McIcon name="Gold_Ingot" size={18} />
                      VIP Ouro
                    </div>
                  </th>
                  <th className="col-vip-destaque">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <McIcon name="Emerald" size={18} />
                      VIP Esmeralda (Recomendado)
                    </div>
                  </th>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <McIcon name="Nether_Star" size={18} />
                      VIP Supremo
                    </div>
                  </th>
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
                      <span className="text-gold-gradient" style={{ fontWeight: 700 }}>
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
            <h2>Pacotes de <span className="highlight">Cash</span></h2>
            <p>Moeda premium para adquirir lotes extras, multiplicadores temporários e itens exclusivos na loja in-game.</p>
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
                    className="btn-comprar-agora"
                    onClick={() => comprarDireto(item)}
                  >
                    Comprar Direto
                  </button>
                  <button
                    className="btn-add-carrinho"
                    onClick={() => handleAdicionar(item)}
                  >
                    Adicionar ao Carrinho
                    <McIcon name="Chest" size={16} />
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
            <h2>Chaves & <span className="highlight">Caixas Misteriosas</span></h2>
            <p>Abra caixas mágicas na praça central do spawn e ganhe equipamentos épicos, poções e relíquias de guerra.</p>
          </div>

          <div className="itens-shop-grid">
            {pacotesChaves.map((item) => (
              <div key={item.id} className={`item-shop-card ${item.bonus === 'Melhor Valor' ? 'mc-enchanted-glint' : ''}`}>
                {item.bonus && <span className="item-shop-badge">{item.bonus}</span>}
                
                <div className="item-shop-icon-box">
                  <McIcon name={item.mcIcon} size={42} />
                </div>

                <h3 className="item-shop-nome">{item.nome}</h3>
                <p className="item-shop-desc">{item.descricao}</p>
                <div className="item-shop-preco">{item.preco}</div>

                <div className="vip-acoes-card">
                  <button
                    className="btn-comprar-agora"
                    onClick={() => comprarDireto(item)}
                  >
                    Comprar Direto
                  </button>
                  <button
                    className="btn-add-carrinho"
                    onClick={() => handleAdicionar(item)}
                  >
                    Adicionar ao Carrinho
                    <McIcon name="Chest" size={16} />
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
            <McIcon name="Chest" size={24} />
            <span>
              <strong>{totalItens} {totalItens === 1 ? 'artigo' : 'artigos'}</strong> no carrinho • Total: <strong>R$ {totalFinal.toFixed(2).replace('.', ',')}</strong>
            </span>
          </div>
          <Link to="/carrinho" className="barra-carrinho-btn">
            Ver Carrinho & Pagar →
          </Link>
        </div>
      )}
    </div>
  );
}
