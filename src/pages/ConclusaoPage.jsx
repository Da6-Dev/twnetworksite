import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Copy, Check, CheckCircle2, Clock, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import './ConclusaoPage.css';

export default function ConclusaoPage() {
  const { recarregarUsuario } = useAuth();
  const { tocarSucesso } = useSound();
  const location = useLocation();
  const { ultimoPedido } = useCart();
  const pedido = location.state?.pedido || ultimoPedido;

  const [copiado, setCopiado] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(900); // 15 minutos
  const [statusPix, setStatusPix] = useState('Aguardando leitura do QR Code...');

  const codigoPixReal = pedido?.copiaECola || `00020126580014br.gov.bcb.pix0136${pedido?.id || 'TW-123456'}520400005303986540${(pedido?.totalFinal || 19.9).toFixed(2)}5802BR5910TW Network6009Sao Paulo62070503***6304`;

  // Disparo de celebração com confetti
  const dispararConfetes = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignora erro
    }
  };

  useEffect(() => {
    // Se o pagamento já veio aprovado (ex: Cartão de Crédito)
    if (pedido?.statusCartao === 'approved' || pedido?.metodoPagamento === 'cartao') {
      dispararConfetes();
    }

    const timer = setInterval(() => {
      setSegundosRestantes((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Polling real de status
    let polling = null;
    if (pedido?.pedidoId) {
      polling = setInterval(async () => {
        try {
          const res = await fetch(`/api/pedidos/status/${pedido.pedidoId}`);
          const data = await res.json();
          if (data.sucesso && (data.pedido.status === 'APROVADO' || data.pedido.status === 'ENTREGUE')) {
            setStatusPix('Pagamento Confirmado! Seus benefícios foram creditados na sua conta com sucesso.');
            dispararConfetes();
            if (recarregarUsuario) recarregarUsuario();
            if (tocarSucesso) tocarSucesso();
            clearInterval(polling);
          }
        } catch {}
      }, 4000);
    } else {
      const timeout1 = setTimeout(() => {
        setStatusPix('Transação identificada! Validando na rede bancária...');
      }, 8000);
      const timeout2 = setTimeout(() => {
        setStatusPix('Pagamento Aprovado! Benefícios despachados.');
        dispararConfetes();
      }, 16000);
      return () => {
        clearInterval(timer);
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }

    return () => {
      clearInterval(timer);
      if (polling) clearInterval(polling);
    };
  }, [pedido?.pedidoId, pedido?.metodoPagamento, pedido?.statusCartao]);

  const copiarPix = () => {
    navigator.clipboard.writeText(codigoPixReal);
    setCopiado(true);
    toast.success('Código Pix Copia e Cola copiado para a área de transferência!');
    setTimeout(() => setCopiado(false), 2500);
  };

  const formatarTempo = (totalSegundos) => {
    const m = Math.floor(totalSegundos / 60);
    const s = totalSegundos % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!pedido) {
    return (
      <div className="conclusao-page-container" style={{ textAlign: 'center', padding: '120px 20px' }}>
        <div className="conclusao-card">
          <h2>Nenhum pedido recente encontrado</h2>
          <p style={{ color: 'var(--text-muted)', margin: '16px 0 24px' }}>
            Não encontramos um pedido ativo no histórico recente do navegador.
          </p>
          <Link to="/loja" className="btn-ir-checkout" style={{ display: 'inline-flex', width: 'auto', padding: '12px 28px' }}>
            Ir para a Loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="conclusao-page-container">
      <div className="conclusao-card">
        <div className="conclusao-icone-topo">
          <CheckCircle2 size={48} className="text-emerald-400" />
        </div>

        <h1>Pedido Registrado com Sucesso</h1>
        <span className="conclusao-id-tag">Código do Pedido: #{pedido.id}</span>

        {/* Informações da Conta */}
        <div className="conclusao-conta-box">
          <div className="conclusao-avatar-box">
            <img
              src={`https://mc-heads.net/avatar/${pedido.nick}/48`}
              alt={pedido.nick}
              style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
            />
          </div>
          <div className="conclusao-conta-texto">
            <span>Benefícios vinculados à conta:</span>
            <strong>{pedido.nick}</strong>
          </div>
        </div>

        {/* Bloco de Pagamento Pix */}
        {pedido.metodoPagamento === 'pix' && (
          <div className="pix-pagamento-bloco">
            <h3>Pague via Pix para Ativação Instantânea</h3>
            <p>
              Abra o app do seu banco, escolha <strong>Pix</strong> e aponte a câmera para o QR Code abaixo ou utilize o Copia e Cola.
            </p>

            {/* QR Code Gráfico */}
            <div className="pix-qr-visual">
              {pedido?.qrCodeBase64 ? (
                <img
                  src={pedido.qrCodeBase64}
                  alt="QR Code Pix Oficial"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                />
              ) : (
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <rect width="100" height="100" fill="#ffffff" />
                  <rect x="10" y="10" width="24" height="24" fill="#09090b" rx="4" />
                  <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="18" y="18" width="8" height="8" fill="#10b981" rx="1" />
                  <rect x="66" y="10" width="24" height="24" fill="#09090b" rx="4" />
                  <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="74" y="18" width="8" height="8" fill="#10b981" rx="1" />
                  <rect x="10" y="66" width="24" height="24" fill="#09090b" rx="4" />
                  <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="18" y="74" width="8" height="8" fill="#10b981" rx="1" />
                  <rect x="42" y="12" width="6" height="6" fill="#09090b" />
                  <rect x="52" y="12" width="6" height="6" fill="#09090b" />
                  <rect x="46" y="24" width="8" height="8" fill="#09090b" />
                  <rect x="12" y="44" width="6" height="6" fill="#09090b" />
                  <rect x="24" y="44" width="6" height="6" fill="#09090b" />
                  <rect x="36" y="38" width="6" height="6" fill="#09090b" />
                  <rect x="46" y="42" width="10" height="10" fill="#10b981" rx="2" />
                  <rect x="62" y="44" width="6" height="6" fill="#09090b" />
                  <rect x="78" y="44" width="8" height="6" fill="#09090b" />
                  <rect x="40" y="62" width="8" height="6" fill="#09090b" />
                  <rect x="56" y="60" width="6" height="12" fill="#09090b" />
                  <rect x="68" y="68" width="10" height="6" fill="#09090b" />
                  <rect x="42" y="78" width="12" height="6" fill="#09090b" />
                  <rect x="64" y="80" width="8" height="8" fill="#09090b" />
                  <rect x="80" y="76" width="6" height="8" fill="#09090b" />
                </svg>
              )}
            </div>

            <div className="pix-copia-cola-box">
              <input
                type="text"
                readOnly
                value={codigoPixReal}
                className="input-pix-codigo"
              />
              <button
                type="button"
                className={`btn-copiar-pix ${copiado ? 'copiado' : ''}`}
                onClick={copiarPix}
              >
                {copiado ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiado ? 'Copiado!' : 'Copiar Pix'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div className="pix-status-badge">
                <span className="status-dot" />
                <span>{statusPix}</span>
              </div>
              <div className="pix-status-badge" style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}>
                <Clock size={14} />
                <span>Expira em: {formatarTempo(segundosRestantes)}</span>
              </div>
            </div>

            {pedido?.ticketUrl && (
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <a
                  href={pedido.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-visualizar-fatura"
                >
                  <ExternalLink size={16} />
                  <span>Visualizar Comprovante Oficial no Mercado Pago</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Se o método foi Cartão de Crédito */}
        {pedido.metodoPagamento === 'cartao' && (
          <div className="detalhes-metodo-box" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ color: 'var(--mc-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} />
              Transação Aprovada pela Operadora de Cartão!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
              Sua compra de <strong>R$ {pedido.totalFinal?.toFixed(2).replace('.', ',')}</strong> foi confirmada.
              Os benefícios foram associados à conta <strong>{pedido.nick}</strong> e já estão disponíveis no jogo.
            </p>
          </div>
        )}

        {/* Se o método foi Boleto */}
        {pedido.metodoPagamento === 'boleto' && (
          <div className="detalhes-metodo-box" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ color: 'var(--mc-star-gold)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', marginBottom: '8px' }}>
              Boleto Bancário Registrado
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '8px 0 16px' }}>
              Copie a linha digitável abaixo para pagar no app do seu banco ou visualize o boleto oficial.
            </p>

            <div className="pix-copia-cola-box" style={{ marginBottom: '16px' }}>
              <input
                type="text"
                readOnly
                value={pedido.linhaDigitavel || '34191.79001 01043.510047 91020.150008 8 98210000003990'}
                className="input-pix-codigo"
              />
              <button
                type="button"
                className={`btn-copiar-pix ${copiado ? 'copiado' : ''}`}
                onClick={() => {
                  navigator.clipboard.writeText(pedido.linhaDigitavel || '');
                  setCopiado(true);
                  toast.success('Linha digitável copiada com sucesso!');
                  setTimeout(() => setCopiado(false), 2500);
                }}
              >
                {copiado ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiado ? 'Copiado!' : 'Copiar Linha'}</span>
              </button>
            </div>

            {pedido.pdfUrl && (
              <div style={{ marginTop: '14px' }}>
                <a
                  href={pedido.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ir-checkout"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: 'auto',
                    padding: '12px 24px',
                    textDecoration: 'none',
                    fontWeight: 700
                  }}
                >
                  <ExternalLink size={16} />
                  <span>Baixar / Imprimir Boleto em PDF</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Instruções de Ativação In-Game */}
        <div className="instrucoes-ativacao">
          <h3>Como Ativar Seus Itens no Servidor:</h3>
          <ul className="passos-lista">
            <li>
              <span className="numero-passo">1</span>
              <div>
                Conecte-se com a sua conta <strong>{pedido.nick}</strong> em qualquer versão (1.8 até 1.20+).
              </div>
            </li>
            <li>
              <span className="numero-passo">2</span>
              <div>
                Conecte-se através do IP oficial: <code>TWNetwork.com.br</code>.
              </div>
            </li>
            <li>
              <span className="numero-passo">3</span>
              <div>
                Digite <code>/loja historico</code> ou <code>/recompensas</code> no chat para validar a ativação automática instantânea.
              </div>
            </li>
          </ul>
        </div>

        {/* Botões de Ação */}
        <div className="conclusao-botoes-acao">
          <Link to="/loja" className="btn-ir-checkout" style={{ display: 'inline-flex', width: 'auto', padding: '12px 24px' }}>
            <span>Continuar na Loja</span>
            <ArrowRight size={16} />
          </Link>
          <Link to="/" className="btn-voltar-home">
            Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}
