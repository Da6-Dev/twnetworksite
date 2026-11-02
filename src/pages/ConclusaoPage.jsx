import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import McIcon from '../components/McIcon';
import './ConclusaoPage.css';

export default function ConclusaoPage() {
  const location = useLocation();
  const { ultimoPedido } = useCart();
  const pedido = location.state?.pedido || ultimoPedido;

  const [copiado, setCopiado] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(900); // 15 minutos
  const [statusPix, setStatusPix] = useState('Aguardando leitura do QR Code...');

  // Código Pix Copia e Cola simulado e válido
  const codigoPixSimulado = `00020126580014br.gov.bcb.pix0136${pedido?.id || 'TW-123456'}520400005303986540${(pedido?.totalFinal || 19.9).toFixed(2)}5802BR5910TW Network6009Sao Paulo62070503***6304`;

  useEffect(() => {
    const timer = setInterval(() => {
      setSegundosRestantes((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Simulação de transição de status para demonstrar o fluxo de automação
    const timeout1 = setTimeout(() => {
      setStatusPix('⚡ Transação identificada! Validando na rede bancária...');
    }, 8000);

    const timeout2 = setTimeout(() => {
      setStatusPix('✅ Pagamento Aprovado! Benefícios despachados para a sua conta.');
    }, 16000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  const copiarPix = () => {
    navigator.clipboard.writeText(codigoPixSimulado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const formatarTempo = (totalSegundos) => {
    const m = Math.floor(totalSegundos / 60);
    const s = totalSegundos % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!pedido) {
    return (
      <div className="conclusao-page-container" style={{ textAlign: 'center' }}>
        <div className="conclusao-card">
          <h2>Nenhum pedido recente encontrado</h2>
          <p style={{ color: '#94a3b8', margin: '16px 0 24px' }}>
            Não encontramos um pedido ativo no histórico recente do navegador.
          </p>
          <Link to="/loja" className="btn-ir-checkout" style={{ display: 'inline-flex', width: 'auto' }}>
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
          <McIcon name="Emerald" size={44} />
        </div>

        <h1>Pedido Concluído com <span className="highlight">Sucesso!</span></h1>
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

        {/* Bloco de Pagamento Pix (se o método foi Pix) */}
        {pedido.metodoPagamento === 'pix' && (
          <div className="pix-pagamento-bloco">
            <h3 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '8px' }}>
              ⚡ Pague via Pix para Ativação Instantânea
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '18px' }}>
              Abra o app do seu banco, escolha <strong>Pix</strong> e aponte a câmera para o QR Code abaixo ou utilize o Copia e Cola.
            </p>

            {/* QR Code Gráfico */}
            <div className="pix-qr-visual">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <rect width="100" height="100" fill="#ffffff" />
                {/* Marcadores de canto padrão do QR Code */}
                <rect x="10" y="10" width="24" height="24" fill="#09090b" rx="4" />
                <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="2" />
                <rect x="18" y="18" width="8" height="8" fill="#7c3aed" rx="1" />

                <rect x="66" y="10" width="24" height="24" fill="#09090b" rx="4" />
                <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="2" />
                <rect x="74" y="18" width="8" height="8" fill="#7c3aed" rx="1" />

                <rect x="10" y="66" width="24" height="24" fill="#09090b" rx="4" />
                <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="2" />
                <rect x="18" y="74" width="8" height="8" fill="#7c3aed" rx="1" />

                {/* Padrões centrais pixelados simulando QR data */}
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
            </div>

            <div className="pix-copia-cola-box">
              <input
                type="text"
                readOnly
                value={codigoPixSimulado}
                className="input-pix-codigo"
              />
              <button
                type="button"
                className={`btn-copiar-pix ${copiado ? 'copiado' : ''}`}
                onClick={copiarPix}
              >
                {copiado ? '✅ Copiado!' : 'Copiar Pix'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="pix-status-badge">
                <span className="status-dot"></span>
                {statusPix}
              </div>
              <div className="pix-status-badge" style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}>
                ⏳ Expira em: {formatarTempo(segundosRestantes)}
              </div>
            </div>
          </div>
        )}

        {/* Se o método foi Cartão de Crédito */}
        {pedido.metodoPagamento === 'cartao' && (
          <div className="detalhes-metodo-box" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <McIcon name="Gold_Ingot" size={20} />
              Transação Aprovada pela Operadora de Cartão!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
              Sua compra de <strong>R$ {pedido.totalFinal?.toFixed(2).replace('.', ',')}</strong> foi confirmada.
              Os benefícios foram associados à conta <strong>{pedido.nick}</strong> e já estão disponíveis no jogo.
            </p>
          </div>
        )}

        {/* Se o método foi Boleto */}
        {pedido.metodoPagamento === 'boleto' && (
          <div className="detalhes-metodo-box" style={{ textAlign: 'left', marginBottom: '32px' }}>
            <h3 style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <McIcon name="Paper" size={20} />
              Boleto Gerado com Sucesso!
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
              Linha Digitável: <code>34191.79001 01043.510047 91020.150008 8 98210000003990</code>
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
              A compensação bancária é realizada em até 1 dia útil após o pagamento.
            </p>
          </div>
        )}

        {/* Instruções de Ativação In-Game */}
        <div className="instrucoes-ativacao">
          <h3>
            <McIcon name="Compass" size={20} />
            Como Ativar Seus Itens Dentro do Jogo:
          </h3>
          <ul className="passos-lista">
            <li>
              <span className="numero-passo">1</span>
              <div>
                Inicie o seu Minecraft (qualquer versão de <strong>1.8.x até 1.20.x</strong>) e conecte-se com a conta <strong>{pedido.nick}</strong>.
              </div>
            </li>
            <li>
              <span className="numero-passo">2</span>
              <div>
                Entre no servidor através do endereço IP: <code>TWNetwork.com.br</code>.
              </div>
            </li>
            <li>
              <span className="numero-passo">3</span>
              <div>
                Abra a janela de chat in-game e digite o comando: <code>/loja historico</code> ou <code>/recompensas</code> para validar a entrega instantânea.
              </div>
            </li>
          </ul>
        </div>

        {/* Botões de Ação */}
        <div className="conclusao-botoes-acao">
          <Link to="/loja" className="btn-ir-checkout" style={{ display: 'inline-flex', width: 'auto', padding: '12px 24px' }}>
            <McIcon name="Chest" size={18} />
            Continuar na Loja
          </Link>
          <Link to="/" className="btn-voltar-home">
            <McIcon name="Grass_Block" size={18} />
            Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}
