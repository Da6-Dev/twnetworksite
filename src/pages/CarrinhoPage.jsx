import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/useCart';
import McIcon from '../components/McIcon';
import CupomDesconto from '../components/CupomDesconto';
import './CarrinhoPage.css';

export default function CarrinhoPage() {
  const {
    carrinho,
    subtotal,
    descontoValor,
    totalFinal,
    cupomAtivo,
    setCupomAtivo,
    atualizarQuantidade,
    removerDoCarrinho,
    limparCarrinho
  } = useCart();

  const parsePrecoUnitario = (item) => {
    if (typeof item.valorNumerico === 'number') return item.valorNumerico;
    const limpo = item.preco.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(limpo) || 0;
  };

  return (
    <div className="carrinho-page-container">
      {/* Breadcrumbs */}
      <nav className="carrinho-breadcrumbs" aria-label="Navegação estrutural">
        <Link to="/">Início</Link>
        <ChevronRight size={14} className="breadcrumb-divisor" />
        <Link to="/loja">Loja</Link>
        <ChevronRight size={14} className="breadcrumb-divisor" />
        <span className="breadcrumb-atual">Meu Carrinho</span>
      </nav>

      <h1 className="carrinho-titulo-topo">Meu Carrinho de Compras</h1>

      {carrinho.length === 0 ? (
        <div className="carrinho-itens-panel carrinho-vazio-box">
          <div className="carrinho-vazio-icone">
            <McIcon name="Chest" size={64} />
          </div>
          <h3>Seu carrinho está vazio</h3>
          <p>Você ainda não adicionou nenhum plano VIP, pacote de Cash ou chaves misteriosas.</p>
          <Link to="/loja" className="btn-explorar-loja">
            <span>Explorar Loja de VIPs</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="carrinho-layout-grid">
          {/* Painel Esquerdo: Itens */}
          <div className="carrinho-itens-panel">
            <div className="carrinho-header-tabela">
              <span>Item &amp; Descrição</span>
              <span>Subtotal</span>
            </div>

            <div className="carrinho-lista-itens">
              {carrinho.map((item, index) => {
                const precoUn = parsePrecoUnitario(item);
                const qtd = item.quantidade || 1;
                const linhaSubtotal = precoUn * qtd;

                return (
                  <div key={item.id || index} className="carrinho-item-linha">
                    <div className="carrinho-item-info">
                      <div className="carrinho-item-icon-box">
                        <McIcon name={item.mcIcon || 'Chest'} size={32} />
                      </div>
                      <div className="carrinho-item-detalhes">
                        <h4>{item.nome}</h4>
                        <span className="carrinho-item-preco-un">
                          Unitário: R$ {precoUn.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    {/* Controles de Quantidade */}
                    <div className="carrinho-item-qtd-controles">
                      <button
                        type="button"
                        className="btn-qtd"
                        onClick={() => atualizarQuantidade(item.id, -1)}
                        title="Diminuir quantidade"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="item-qtd-num">{qtd}</span>
                      <button
                        type="button"
                        className="btn-qtd"
                        onClick={() => atualizarQuantidade(item.id, 1)}
                        title="Aumentar quantidade"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="carrinho-item-subtotal">
                      R$ {linhaSubtotal.toFixed(2).replace('.', ',')}
                    </div>

                    <button
                      type="button"
                      className="btn-remover-item-tabela"
                      onClick={() => removerDoCarrinho(item.id)}
                      title="Remover do carrinho"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Cupom de Desconto */}
            <div className="carrinho-cupom-area">
              <CupomDesconto onAplicarCupom={setCupomAtivo} cupomAtivo={cupomAtivo} />
            </div>

            <div className="carrinho-limpar-area">
              <button
                type="button"
                onClick={limparCarrinho}
                className="btn-limpar-carrinho"
              >
                Esvaziar todo o carrinho
              </button>
            </div>
          </div>

          {/* Painel Direito: Resumo */}
          <div className="carrinho-resumo-card">
            <h3>Resumo do Pedido</h3>

            <div className="resumo-linha-item">
              <span>Subtotal dos itens:</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>

            {cupomAtivo && (
              <div className="resumo-linha-item desconto">
                <span>Cupom ({cupomAtivo.codigo}):</span>
                <span>- R$ {descontoValor.toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            <div className="resumo-divisor" />

            <div className="resumo-total-final">
              <span>Total a Pagar:</span>
              <span className="valor-destaque">
                R$ {totalFinal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <Link to="/checkout" className="btn-ir-checkout">
              <span>Avançar para Pagamento</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/loja" className="btn-continuar-comprando">
              <ArrowLeft size={16} />
              <span>Continuar Comprando</span>
            </Link>

            <div className="carrinho-seguranca-selos">
              <div>
                <McIcon name="Emerald" size={18} />
                <span>Ativação automatizada imediata via Pix</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
