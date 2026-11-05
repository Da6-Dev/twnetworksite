import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useCart } from '../context/useCart';
import { useSound } from '../context/SoundContext';
import AnimatedTabs from '../components/ui/AnimatedTabs';
import McIcon from '../components/McIcon';
import { planosVipOficiais, pacotesChavesOficiais } from '../data/serverData';
import './LojaPage.css';

export default function LojaPage() {
  const { adicionarAoCarrinho, totalItens, totalFinal } = useCart();
  const { tocarXP, tocarClique } = useSound();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('todos');

  const planosVip = planosVipOficiais;

  const comparativoRecursos = [
    { recurso: 'Tag Exclusiva no Chat & Tab', festivo: 'Festivo', nevasca: 'Nevasca', polar: 'Polar ✨' },
    { recurso: 'Canal Exclusivo (/vc)', festivo: 'Liberado', nevasca: 'Liberado', polar: 'Liberado com Destaque' },
    { recurso: 'Acesso às Minas VIPs', festivo: 'Mina Festivo (Nether Gold)', nevasca: 'Festivo & Nevasca (Quartz)', polar: 'Todas + Polar (Ancient Debris)' },
    { recurso: 'Comando /fly (Voar)', festivo: 'Terrenos', nevasca: 'Lobbys e Terrenos', polar: 'Global Autorizado' },
    { recurso: 'Multiplicador de Venda (/sell)', festivo: '+25% (1.25x)', nevasca: '+50% (1.50x)', polar: '+100% (2.0x Dobro)' },
    { recurso: 'Comando /reparar Grátis', festivo: 'A cada 4 horas', nevasca: 'Ilimitado', polar: 'Ilimitado (/reparar tudo)' },
    { recurso: 'Comandos /feed e /hat', festivo: 'Não', nevasca: '/feed', polar: '/feed & /hat' },
    { recurso: 'Entrada com Servidor Lotado', festivo: 'Fila Rápida', nevasca: 'Prioridade Alta', polar: 'Acesso Imediato 100%' },
    { recurso: 'Lotes de Terrenos (PlotSquared)', festivo: '3 Lotes', nevasca: '5 Lotes', polar: '10 Lotes (Megabase)' },
    { recurso: 'Chave Misteriosa Semanal (/correio)', festivo: '1x Chave Festiva', nevasca: '2x Chaves Nevadas', polar: '1x Chave Divina Semanal' }
  ];

  const pacotesCash = [
    {
      id: 101,
      nome: '5.000 Cash',
      preco: 'R$ 10,00',
      valor: 10.0,
      mcIcon: 'Gold_Ingot',
      bonus: null,
      descricao: 'Saldo essencial para pequenas compras, encantamentos rápidos e trocas in-game.'
    },
    {
      id: 102,
      nome: '15.000 Cash (+2.000 Bônus)',
      preco: 'R$ 25,00',
      valor: 25.0,
      mcIcon: 'Diamond',
      bonus: '+15% Bônus',
      descricao: 'Pacote mais vendido. Ideal para impulsionar suas construções e maquinários.'
    },
    {
      id: 103,
      nome: '40.000 Cash (+10.000 Bônus)',
      preco: 'R$ 50,00',
      valor: 50.0,
      mcIcon: 'Nether_Star',
      bonus: '+25% Bônus',
      descricao: 'Quantidade colossal para dominar o topo do ranking de fortuna da temporada.'
    }
  ];

  const pacotesChaves = pacotesChavesOficiais;

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
                  <th>VIP Festivo</th>
                  <th className="col-vip-destaque">VIP Nevasca (Recomendado)</th>
                  <th>VIP Polar ✨</th>
                </tr>
              </thead>
              <tbody>
                {comparativoRecursos.map((item, index) => (
                  <tr key={index}>
                    <td className="col-recurso">{item.recurso}</td>
                    <td>{item.festivo}</td>
                    <td className="destaque-col">
                      <strong>{item.nevasca}</strong>
                    </td>
                    <td>
                      <span className="font-bold text-amber-400">
                        {item.polar}
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
