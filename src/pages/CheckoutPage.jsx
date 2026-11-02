import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useOrders } from '../context/OrderContext';
import { useSound } from '../context/SoundContext';
import { useAuth } from '../context/AuthContext';
import McIcon from '../components/McIcon';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { carrinho, subtotal, descontoValor, totalFinal, cupomAtivo, concluirPedido } = useCart();
  const { registrarNovoPedido } = useOrders();
  const { tocarSucesso } = useSound();
  const { usuario, estaLogado } = useAuth();
  const navigate = useNavigate();

  const [nick, setNick] = useState(() => (usuario ? usuario.nick : ''));
  const [email, setEmail] = useState(() => (usuario ? usuario.email : ''));
  const [discord, setDiscord] = useState('');
  const [metodo, setMetodo] = useState('pix');
  const [erroNick, setErroNick] = useState('');

  // Se o carrinho estiver vazio, sugere voltar para a loja
  if (carrinho.length === 0) {
    return (
      <div className="checkout-page-container" style={{ textAlign: 'center', padding: '120px 20px' }}>
        <McIcon name="Chest" size={64} />
        <h2 style={{ color: 'var(--text-primary)', margin: '20px 0 10px', fontWeight: 800 }}>Nenhum item no carrinho</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Adicione primeiro um VIP, Cash ou Chaves na loja antes de finalizar o pagamento.
        </p>
        <Link to="/loja" className="btn-ir-checkout" style={{ display: 'inline-flex', width: 'auto', padding: '12px 28px' }}>
          Voltar para a Loja
        </Link>
      </div>
    );
  }

  const handleFinalizar = (e) => {
    e.preventDefault();
    if (!nick.trim()) {
      setErroNick('Por favor, digite o seu Nick do Minecraft!');
      return;
    }

    setErroNick('');
    
    // Registra o pedido no histórico do jogador pesquisável no Hub
    registrarNovoPedido({
      nick: nick.trim(),
      itens: carrinho,
      total: totalFinal,
      metodo: metodo === 'pix' ? 'Pix Instantâneo' : 'Cartão de Crédito'
    });

    tocarSucesso();

    const pedidoConcluido = concluirPedido({
      nick: nick.trim(),
      email: email.trim() || 'recibo@twnetwork.com.br',
      discord: discord.trim() || 'N/A',
      metodoPagamento: metodo
    });

    navigate('/conclusao', { state: { pedido: pedidoConcluido } });
  };

  return (
    <div className="checkout-page-container">
      {/* Breadcrumbs */}
      <div className="carrinho-breadcrumbs">
        <Link to="/">Início</Link>
        <span>/</span>
        <Link to="/loja">Loja</Link>
        <span>/</span>
        <Link to="/carrinho">Carrinho</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Finalizar Pagamento</span>
      </div>

      <h1 className="carrinho-titulo-topo">
        Checkout & <span className="highlight">Pagamento Seguro</span>
      </h1>

      <form onSubmit={handleFinalizar} className="checkout-grid">
        {/* Painel Esquerdo: Formulário */}
        <div className="checkout-form-panel">
          {/* Passo 1: Conta do Jogador */}
          <div className="checkout-passo-titulo">
            <span className="passo-numero">1</span>
            Conta Minecraft para Entrega
          </div>

          {estaLogado && usuario && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--badge-bg)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--mc-emerald)',
              fontSize: '0.85rem',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <McIcon name="Emerald" size={14} />
              <span>Conectado como <strong>{usuario.nick}</strong> — Pacotes serão vinculados à sua conta.</span>
            </div>
          )}

          <div className="conta-preview-box">
            <div className="conta-avatar-wrapper">
              <img
                src={
                  nick.trim()
                    ? `https://mc-heads.net/avatar/${nick.trim()}/64`
                    : 'https://mc-heads.net/avatar/steve/64'
                }
                alt="Avatar"
                className="conta-avatar-img"
              />
            </div>

            <div className="campo-nick-wrapper">
              <label htmlFor="inputNick">
                Nick in-game (exatamente como registrado):
              </label>
              <input
                id="inputNick"
                type="text"
                placeholder="Ex: TeDabliukkkkk"
                value={nick}
                onChange={(e) => {
                  setNick(e.target.value);
                  if (erroNick) setErroNick('');
                }}
                className="input-checkout-nick"
                required
              />
              {erroNick && (
                <p style={{ color: '#ef4444', fontSize: '0.825rem', marginTop: '4px' }}>
                  {erroNick}
                </p>
              )}
            </div>
          </div>

          <div className="campos-contato-linha">
            <div className="form-campo">
              <label htmlFor="email">E-mail para Recibo (opcional):</label>
              <input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-checkout-padrao"
              />
            </div>
            <div className="form-campo">
              <label htmlFor="discord">Discord Tag (opcional):</label>
              <input
                id="discord"
                type="text"
                placeholder="Ex: usuario#0000"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                className="input-checkout-padrao"
              />
            </div>
          </div>

          {/* Passo 2: Método de Pagamento */}
          <div className="checkout-passo-titulo">
            <span className="passo-numero">2</span>
            Forma de Pagamento
          </div>

          <div className="metodos-pagamento-grid">
            <div
              className={`card-metodo ${metodo === 'pix' ? 'selecionado' : ''}`}
              onClick={() => setMetodo('pix')}
            >
              <McIcon name="Redstone" size={28} />
              <span className="card-metodo-titulo">⚡ Pix Instantâneo</span>
              <span className="card-metodo-sub">Ativação em 1 minuto</span>
            </div>

            <div
              className={`card-metodo ${metodo === 'cartao' ? 'selecionado' : ''}`}
              onClick={() => setMetodo('cartao')}
            >
              <McIcon name="Gold_Ingot" size={28} />
              <span className="card-metodo-titulo">💳 Cartão de Crédito</span>
              <span className="card-metodo-sub">Até 3x sem juros</span>
            </div>

            <div
              className={`card-metodo ${metodo === 'boleto' ? 'selecionado' : ''}`}
              onClick={() => setMetodo('boleto')}
            >
              <McIcon name="Paper" size={28} />
              <span className="card-metodo-titulo">📄 Boleto Bancário</span>
              <span className="card-metodo-sub">Compensação bancária</span>
            </div>
          </div>

          {metodo === 'pix' && (
            <div className="detalhes-metodo-box">
              <div className="pix-info-destaque">
                <McIcon name="Emerald" size={20} />
                Método Mais Rápido & Recomendado
              </div>
              <p className="pix-info-sub">
                Ao clicar em finalizar, o QR Code e o código Pix Copia e Cola serão gerados imediatamente.
                Nosso bot sincronizado com o banco aprova e entrega os itens na sua conta sem necessidade de aprovação manual.
              </p>
            </div>
          )}

          {metodo === 'cartao' && (
            <div className="detalhes-metodo-box">
              <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>
                💳 Pagamento Seguro com Criptografia SSL
              </div>
              <p className="pix-info-sub">
                Transação protegida e processada com operadoras seguras. O VIP ou Cash é ativado assim que a operadora confirmar a compra.
              </p>
            </div>
          )}

          {metodo === 'boleto' && (
            <div className="detalhes-metodo-box">
              <div style={{ color: '#eab308', fontWeight: 700, marginBottom: '6px' }}>
                📄 Emissão de Linha Digitável
              </div>
              <p className="pix-info-sub">
                O código de barras do boleto será disponibilizado após a confirmação. A liberação ocorre assim que o banco liquidar a compensação (1 a 3 dias úteis).
              </p>
            </div>
          )}

          <button type="submit" className="btn-finalizar-pedido">
            <McIcon name="Chest" size={20} />
            Confirmar e Gerar Pagamento
          </button>
        </div>

        {/* Painel Direito: Resumo */}
        <div className="resumo-pedido-sidebar">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
            Itens do Pedido ({carrinho.length})
          </h3>

          <div className="sidebar-itens-lista">
            {carrinho.map((item, index) => (
              <div key={index} className="sidebar-item-linha">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <McIcon name={item.mcIcon || 'Chest'} size={20} />
                  <span>
                    {item.nome} {item.quantidade > 1 ? `(${item.quantidade}x)` : ''}
                  </span>
                </div>
                <strong style={{ color: '#f1f5f9' }}>{item.preco}</strong>
              </div>
            ))}
          </div>

          <div className="resumo-linha-item">
            <span>Subtotal:</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>

          {cupomAtivo && (
            <div className="resumo-linha-item desconto">
              <span>Desconto ({cupomAtivo.codigo}):</span>
              <span>- R$ {descontoValor.toFixed(2).replace('.', ',')}</span>
            </div>
          )}

          <div className="resumo-divisor"></div>

          <div className="resumo-total-final">
            <span>Total:</span>
            <span className="valor-destaque">
              R$ {totalFinal.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <Link to="/carrinho" className="btn-continuar-comprando" style={{ marginBottom: '16px' }}>
            ← Modificar Carrinho
          </Link>

          <div className="carrinho-seguranca-selos">
            <div>
              <McIcon name="Totem_Of_Undying" size={16} />
              Entrega Garantida para: <strong>{nick.trim() || 'Jogador'}</strong>
            </div>
            <div>
              <McIcon name="Beacon" size={16} />
              Servidor Oficial TW Network
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
