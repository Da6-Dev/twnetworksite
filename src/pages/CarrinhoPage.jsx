import React from 'react';
import { Link } from 'react-router-dom';
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
      <div className="carrinho-breadcrumbs">
        <Link to="/">Início</Link>
        <span>/</span>
        <Link to="/loja">Loja</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Meu Carrinho</span>
      </div>

      <h1 className="carrinho-titulo-topo">
        Meu <span className="highlight">Carrinho de Compras</span>
      </h1>

      {carrinho.length === 0 ? (
        <div className="carrinho-itens-panel carrinho-vazio-box">
          <McIcon name="Chest" size={64} />
          <h3>Seu carrinho está vazio!</h3>
          <p>Você ainda não adicionou nenhum plano VIP, pacote de Cash ou chaves misteriosas.</p>
          <Link to="/loja" className="btn-explorar-loja">
            <McIcon name="Diamond" size={18} />
            Explorar Loja de VIPs
          </Link>
        </div>
      ) : (
        <div className="carrinho-layout-grid">
          {/* Painel Esquerdo: Itens */}
          <div className="carrinho-itens-panel">
            <div className="carrinho-header-tabela">
              <span>Item & Descrição</span>
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
                        −
                      </button>
                      <span className="item-qtd-num">{qtd}</span>
                      <button
                        type="button"
                        className="btn-qtd"
                        onClick={() => atualizarQuantidade(item.id, 1)}
                        title="Aumentar quantidade"
                      >
                        +
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
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Cupom de Desconto */}
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <CupomDesconto onAplicarCupom={setCupomAtivo} cupomAtivo={cupomAtivo} />
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={limparCarrinho}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Esvaziar todo o carrinho
              </button>
            </div>
          </div>

          {/* Painel Direito: Resumo */}
          <div className="carrinho-resumo-card">
            <h3>Resumo da Encomenda</h3>

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

            <div className="resumo-divisor"></div>

            <div className="resumo-total-final">
              <span>Total a Pagar:</span>
              <span className="valor-destaque">
                R$ {totalFinal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <Link to="/checkout" className="btn-ir-checkout">
              Avançar para Pagamento
              <McIcon name="Redstone" size={18} />
            </Link>

            <Link to="/loja" className="btn-continuar-comprando">
              ← Continuar Comprando
            </Link>

            <div className="carrinho-seguranca-selos">
              <div>
                <McIcon name="Totem_Of_Undying" size={16} />
                Entrega instantânea in-game via Pix
              </div>
              <div>
                <McIcon name="Emerald" size={16} />
                Garantia de ativação TW Network
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
