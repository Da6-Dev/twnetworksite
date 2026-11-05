import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, CreditCard, FileText, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
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
  const [carregando, setCarregando] = useState(false);
  const [erroPagamento, setErroPagamento] = useState('');

  // Formulário do Cartão de Crédito
  const [cartao, setCartao] = useState({
    numero: '',
    nomeTitular: '',
    mes: '01',
    ano: '2027',
    cvv: '',
    cpf: '',
    parcelas: '1'
  });

  // Formulário do Boleto Bancário
  const [boleto, setBoleto] = useState({
    nome: '',
    cpf: ''
  });

  const formatarNumeroCartao = (val) => {
    const limpo = val.replace(/\D/g, '').slice(0, 16);
    return limpo.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatarCpf = (val) => {
    const limpo = val.replace(/\D/g, '').slice(0, 11);
    if (limpo.length <= 3) return limpo;
    if (limpo.length <= 6) return `${limpo.slice(0, 3)}.${limpo.slice(3)}`;
    if (limpo.length <= 9) return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6)}`;
    return `${limpo.slice(0, 3)}.${limpo.slice(3, 6)}.${limpo.slice(6, 9)}-${limpo.slice(9)}`;
  };

  if (carrinho.length === 0) {
    return (
      <div className="checkout-page-container" style={{ textAlign: 'center', padding: '120px 20px' }}>
        <McIcon name="Chest" size={64} style={{ display: 'inline-flex', marginBottom: '16px' }} />
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

  const handleFinalizar = async (e) => {
    e.preventDefault();
    if (!nick.trim()) {
      setErroNick('Por favor, digite o seu Nick do Minecraft!');
      return;
    }

    setErroNick('');
    setErroPagamento('');
    setCarregando(true);

    try {
      // 1. FLUXO PIX
      if (metodo === 'pix') {
        const authToken = localStorage.getItem('tw_auth_token');
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const res = await fetch('/api/checkout/pix', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            nick: nick.trim(),
            email: email.trim() || 'recibo@twnetwork.com.br',
            discord: discord.trim() || 'N/A',
            itens: carrinho,
            valorTotal: totalFinal
          })
        });

        const data = await res.json();
        if (!res.ok || !data.sucesso) {
          setErroPagamento(data.mensagem || 'Falha ao gerar cobrança Pix.');
          setCarregando(false);
          return;
        }

        registrarNovoPedido({
          nick: nick.trim(),
          itens: carrinho,
          total: totalFinal,
          metodo: 'Pix',
          status: 'pendente',
          pedidoId: data.pedidoId
        });

        tocarSucesso();

        const pedidoConcluido = concluirPedido({
          nick: nick.trim(),
          email: email.trim() || 'recibo@twnetwork.com.br',
          discord: discord.trim() || 'N/A',
          metodoPagamento: 'pix',
          pedidoId: data.pedidoId,
          copiaECola: data.copiaECola,
          qrCodeBase64: data.qrCodeBase64
        });

        navigate('/conclusao', {
          state: {
            pedido: {
              ...pedidoConcluido,
              pedidoId: data.pedidoId,
              copiaECola: data.copiaECola,
              qrCodeBase64: data.qrCodeBase64,
              metodoPagamento: 'pix',
              totalFinal
            }
          }
        });
        return;
      }

      // 2. FLUXO CARTÃO DE CRÉDITO
      if (metodo === 'cartao') {
        if (!cartao.numero || !cartao.nomeTitular || !cartao.cvv || !cartao.cpf) {
          setErroPagamento('Preencha todos os dados do cartão de crédito (número, titular, CVV e CPF).');
          setCarregando(false);
          return;
        }

        const authToken = localStorage.getItem('tw_auth_token');
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const res = await fetch('/api/checkout/cartao', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            nick: nick.trim(),
            email: email.trim() || 'recibo@twnetwork.com.br',
            discord: discord.trim() || 'N/A',
            itens: carrinho,
            valorTotal: totalFinal,
            cartao
          })
        });

        const data = await res.json();
        if (!res.ok || !data.sucesso) {
          setErroPagamento(data.mensagem || 'Não foi possível autorizar o cartão no Mercado Pago.');
          setCarregando(false);
          return;
        }

        registrarNovoPedido({
          nick: nick.trim(),
          itens: carrinho,
          total: totalFinal,
          metodo: `Cartão de Crédito (${cartao.parcelas}x)`,
          status: data.status ? data.status.toLowerCase() : 'aprovado',
          pedidoId: data.pedidoId
        });

        tocarSucesso();

        const pedidoConcluido = concluirPedido({
          nick: nick.trim(),
          email: email.trim() || 'recibo@twnetwork.com.br',
          discord: discord.trim() || 'N/A',
          metodoPagamento: 'cartao',
          pedidoId: data.pedidoId,
          statusCartao: data.status
        });

        navigate('/conclusao', {
          state: {
            pedido: {
              ...pedidoConcluido,
              pedidoId: data.pedidoId,
              statusCartao: data.status,
              metodoPagamento: 'cartao',
              totalFinal
            }
          }
        });
        return;
      }

      // 3. FLUXO BOLETO BANCÁRIO
      if (metodo === 'boleto') {
        if (!boleto.nome || !boleto.cpf) {
          setErroPagamento('Informe o seu Nome Completo e CPF para emissão do boleto.');
          setCarregando(false);
          return;
        }

        const authToken = localStorage.getItem('tw_auth_token');
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const res = await fetch('/api/checkout/boleto', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            nick: nick.trim(),
            email: email.trim() || 'recibo@twnetwork.com.br',
            discord: discord.trim() || 'N/A',
            itens: carrinho,
            valorTotal: totalFinal,
            boleto
          })
        });

        const data = await res.json();
        if (!res.ok || !data.sucesso) {
          setErroPagamento(data.mensagem || 'Erro ao gerar o boleto bancário no Mercado Pago.');
          setCarregando(false);
          return;
        }

        registrarNovoPedido({
          nick: nick.trim(),
          itens: carrinho,
          total: totalFinal,
          metodo: 'Boleto Bancário',
          status: 'pendente',
          pedidoId: data.pedidoId
        });

        tocarSucesso();

        const pedidoConcluido = concluirPedido({
          nick: nick.trim(),
          email: email.trim() || 'recibo@twnetwork.com.br',
          discord: discord.trim() || 'N/A',
          metodoPagamento: 'boleto',
          pedidoId: data.pedidoId,
          linhaDigitavel: data.linhaDigitavel,
          pdfUrl: data.pdfUrl
        });

        navigate('/conclusao', {
          state: {
            pedido: {
              ...pedidoConcluido,
              pedidoId: data.pedidoId,
              linhaDigitavel: data.linhaDigitavel,
              pdfUrl: data.pdfUrl,
              metodoPagamento: 'boleto',
              totalFinal
            }
          }
        });
        return;
      }
    } catch (err) {
      console.error('Erro geral no checkout:', err);
      setErroPagamento('Erro de comunicação com o servidor de pagamento.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="checkout-page-container">
      {/* Breadcrumbs */}
      <nav className="carrinho-breadcrumbs" aria-label="Navegação estrutural">
        <Link to="/">Início</Link>
        <ChevronRight size={14} className="breadcrumb-divisor" />
        <Link to="/loja">Loja</Link>
        <ChevronRight size={14} className="breadcrumb-divisor" />
        <Link to="/carrinho">Carrinho</Link>
        <ChevronRight size={14} className="breadcrumb-divisor" />
        <span className="breadcrumb-atual">Finalizar Pagamento</span>
      </nav>

      <h1 className="carrinho-titulo-topo">Finalização de Pedido</h1>

      <form onSubmit={handleFinalizar} className="checkout-grid">
        {/* Painel Esquerdo: Formulário */}
        <div className="checkout-form-panel">
          {/* Passo 1: Conta do Jogador */}
          <div className="checkout-passo-titulo">
            <span className="passo-numero">1</span>
            <span>Conta de Minecraft para Entrega</span>
          </div>

          {estaLogado && usuario && (
            <div className="checkout-auth-info">
              <McIcon name="Compass" size={16} />
              <span>Conectado como <strong>{usuario.nick}</strong> — Os benefícios serão entregues nesta conta.</span>
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
              <label htmlFor="nick">Nickname exato no Minecraft:</label>
              <input
                id="nick"
                type="text"
                placeholder="Ex: TeDabliukkkkk"
                value={nick}
                onChange={(e) => {
                  setNick(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''));
                  setErroNick('');
                }}
                className="input-checkout-nick"
                required
              />
              {erroNick && <span className="msg-erro-validacao">{erroNick}</span>}
            </div>
          </div>

          <div className="form-linha-dupla">
            <div className="campo-checkout-padrao">
              <label htmlFor="email">E-mail para Comprovante:</label>
              <input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="campo-checkout-padrao">
              <label htmlFor="discord">Discord Tag (opcional):</label>
              <input
                id="discord"
                type="text"
                placeholder="Ex: seu_usuario"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
              />
            </div>
          </div>

          {/* Passo 2: Método de Pagamento */}
          <div className="checkout-passo-titulo">
            <span className="passo-numero">2</span>
            <span>Forma de Pagamento</span>
          </div>

          <div className="metodos-pagamento-grid">
            <div
              className={`card-metodo ${metodo === 'pix' ? 'selecionado' : ''}`}
              onClick={() => setMetodo('pix')}
            >
              <span className="card-metodo-badge">Recomendado</span>
              <QrCode size={28} className="text-emerald-400" />
              <span className="card-metodo-titulo">Pix Instantâneo</span>
              <span className="card-metodo-sub">Aprovação em segundos</span>
            </div>

            <div
              className={`card-metodo ${metodo === 'cartao' ? 'selecionado' : ''}`}
              onClick={() => setMetodo('cartao')}
            >
              <span className="card-metodo-badge" style={{ background: '#3b82f6' }}>Até 12x</span>
              <CreditCard size={28} className="text-sky-400" />
              <span className="card-metodo-titulo">Cartão de Crédito</span>
              <span className="card-metodo-sub">Liberação imediata</span>
            </div>

            <div
              className={`card-metodo ${metodo === 'boleto' ? 'selecionado' : ''}`}
              onClick={() => setMetodo('boleto')}
            >
              <FileText size={28} className="text-amber-400" />
              <span className="card-metodo-titulo">Boleto Bancário</span>
              <span className="card-metodo-sub">Linha digitável &amp; PDF</span>
            </div>
          </div>

          {/* DETALHES PIX */}
          {metodo === 'pix' && (
            <div className="detalhes-metodo-box">
              <div className="pix-info-destaque">
                <QrCode size={20} className="text-emerald-400" />
                <span>Pix via Banco Central / Mercado Pago</span>
              </div>
              <p className="pix-info-sub">
                Ao clicar em finalizar, o <strong>QR Code oficial e o código Pix Copia e Cola</strong> serão gerados na hora nesta mesma tela. Assim que você pagar no seu banco, o sistema valida a transação automaticamente!
              </p>
            </div>
          )}

          {/* DETALHES CARTÃO DE CRÉDITO */}
          {metodo === 'cartao' && (
            <div className="detalhes-metodo-box">
              <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.05rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} />
                <span>Dados do Cartão de Crédito (Pagamento Criptografado)</span>
              </div>
              <p className="pix-info-sub">
                Preencha os dados abaixo. O processamento é realizado diretamente com criptografia bancária do Mercado Pago.
              </p>

              <div className="cartao-form-grid">
                <div className="cartao-campo">
                  <label>Número do Cartão:</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cartao.numero}
                    onChange={(e) => setCartao({ ...cartao, numero: formatarNumeroCartao(e.target.value) })}
                    className="input-cartao-gamer"
                    required
                  />
                </div>

                <div className="cartao-campo">
                  <label>Nome no Cartão (como impresso):</label>
                  <input
                    type="text"
                    placeholder="Ex: DAVI PASSOS"
                    value={cartao.nomeTitular}
                    onChange={(e) => setCartao({ ...cartao, nomeTitular: e.target.value.toUpperCase() })}
                    className="input-cartao-gamer"
                    required
                  />
                </div>

                <div className="cartao-linha-tripla">
                  <div className="cartao-campo">
                    <label>Mês:</label>
                    <select
                      value={cartao.mes}
                      onChange={(e) => setCartao({ ...cartao, mes: e.target.value })}
                      className="input-cartao-gamer"
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const m = (i + 1).toString().padStart(2, '0');
                        return <option key={m} value={m}>{m}</option>;
                      })}
                    </select>
                  </div>

                  <div className="cartao-campo">
                    <label>Ano:</label>
                    <select
                      value={cartao.ano}
                      onChange={(e) => setCartao({ ...cartao, ano: e.target.value })}
                      className="input-cartao-gamer"
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const y = (2026 + i).toString();
                        return <option key={y} value={y}>{y}</option>;
                      })}
                    </select>
                  </div>

                  <div className="cartao-campo">
                    <label>CVV:</label>
                    <input
                      type="password"
                      placeholder="123"
                      maxLength={4}
                      value={cartao.cvv}
                      onChange={(e) => setCartao({ ...cartao, cvv: e.target.value.replace(/\D/g, '') })}
                      className="input-cartao-gamer"
                      required
                    />
                  </div>
                </div>

                <div className="cartao-linha-dupla">
                  <div className="cartao-campo">
                    <label>CPF do Titular:</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      maxLength={14}
                      value={cartao.cpf}
                      onChange={(e) => setCartao({ ...cartao, cpf: formatarCpf(e.target.value) })}
                      className="input-cartao-gamer"
                      required
                    />
                  </div>

                  <div className="cartao-campo">
                    <label>Parcelas:</label>
                    <select
                      value={cartao.parcelas}
                      onChange={(e) => setCartao({ ...cartao, parcelas: e.target.value })}
                      className="input-cartao-gamer"
                    >
                      <option value="1">1x de R$ {totalFinal.toFixed(2).replace('.', ',')} (Sem juros)</option>
                      <option value="2">2x de R$ {(totalFinal / 2).toFixed(2).replace('.', ',')}</option>
                      <option value="3">3x de R$ {(totalFinal / 3).toFixed(2).replace('.', ',')}</option>
                      <option value="6">6x de R$ {(totalFinal / 6).toFixed(2).replace('.', ',')}</option>
                      <option value="12">12x de R$ {(totalFinal / 12).toFixed(2).replace('.', ',')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DETALHES BOLETO BANCÁRIO */}
          {metodo === 'boleto' && (
            <div className="detalhes-metodo-box">
              <div style={{ color: '#eab308', fontWeight: 800, fontSize: '1.05rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} />
                <span>Emissão de Boleto Bancário Registrado</span>
              </div>
              <p className="pix-info-sub">
                O Banco Central exige nome e CPF para emissão de boleto bancário. O código de barras e o PDF para download serão exibidos diretamente no site.
              </p>

              <div className="cartao-form-grid">
                <div className="cartao-campo">
                  <label>Nome Completo do Pagador:</label>
                  <input
                    type="text"
                    placeholder="Ex: Davi Passos"
                    value={boleto.nome}
                    onChange={(e) => setBoleto({ ...boleto, nome: e.target.value })}
                    className="input-cartao-gamer"
                    required
                  />
                </div>

                <div className="cartao-campo">
                  <label>CPF do Pagador:</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    value={boleto.cpf}
                    onChange={(e) => setBoleto({ ...boleto, cpf: formatarCpf(e.target.value) })}
                    className="input-cartao-gamer"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {erroPagamento && (
            <div className="checkout-erro-alerta">
              <AlertCircle size={18} />
              <span>{erroPagamento}</span>
            </div>
          )}

          <button type="submit" className="btn-finalizar-pedido" disabled={carregando}>
            {carregando ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                <span>Processando Pagamento...</span>
              </span>
            ) : (
              <>
                {metodo === 'pix' && 'Gerar QR Code Pix Oficial'}
                {metodo === 'cartao' && `Pagar R$ ${totalFinal.toFixed(2).replace('.', ',')} no Cartão`}
                {metodo === 'boleto' && 'Emitir Boleto Bancário Oficial'}
              </>
            )}
          </button>
        </div>

        {/* Painel Direito: Resumo */}
        <div className="checkout-resumo-lateral">
          <h3>Resumo da Compra</h3>

          <div className="checkout-lista-itens">
            {carrinho.map((item, index) => (
              <div key={`${item.id}-${index}`} className="checkout-item-mini">
                <span>
                  {item.nome || item.name} {item.quantidade > 1 ? `x${item.quantidade}` : ''}
                </span>
                <strong>{item.preco || item.price}</strong>
              </div>
            ))}
          </div>

          <div className="checkout-resumo-totais">
            <div className="resumo-linha">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>

            {cupomAtivo && descontoValor > 0 && (
              <div className="resumo-linha desconto">
                <span>Desconto ({cupomAtivo.codigo}):</span>
                <span>- R$ {descontoValor.toFixed(2).replace('.', ',')}</span>
              </div>
            )}

            <div className="resumo-linha-total">
              <span>Total:</span>
              <span className="total-valor">R$ {totalFinal.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
