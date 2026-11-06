import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import McIcon from '../components/McIcon';
import './CadastroPage.css';

export default function CadastroPage() {
  const { cadastrar, loginComGoogle, validarNickMinecraft, estaLogado } = useAuth();
  const { tocarClique, tocarSucesso } = useSound();
  const navigate = useNavigate();

  const [nick, setNick] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [statusNick, setStatusNick] = useState(null);

  useEffect(() => {
    if (estaLogado) {
      navigate('/perfil');
    }
  }, [estaLogado, navigate]);

  const handleNickChange = (e) => {
    const valor = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
    setNick(valor);
    if (!valor.trim()) {
      setStatusNick(null);
    }
  };

  // Validação em tempo real do Nick de Minecraft
  useEffect(() => {
    if (!nick.trim()) return;
    let cancelado = false;
    const timer = setTimeout(async () => {
      const res = await validarNickMinecraft(nick.trim());
      if (!cancelado) {
        setStatusNick(res);
      }
    }, 250);
    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [nick, validarNickMinecraft]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nick.trim()) {
      setErro('Informe o seu Nick in-game do Minecraft.');
      return;
    }

    if (nick.trim().length < 3) {
      setErro('O Nick deve ter pelo menos 3 caracteres.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErro('Digite um endereço de e-mail válido.');
      return;
    }

    if (senha.length < 3) {
      setErro('A senha deve ter no mínimo 3 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas digitadas não coincidem.');
      return;
    }

    setCarregando(true);
    setErro('');

    const res = await cadastrar({ nick, email, senha });
    setCarregando(false);
    if (res.sucesso) {
      tocarSucesso();
      navigate('/perfil');
    } else {
      setErro(res.mensagem || 'Falha ao cadastrar conta.');
    }
  };

  const [googleClientId, setGoogleClientId] = useState('');

  // Inicialização do Google Identity Services oficial
  useEffect(() => {
    fetch('/api/auth/google/client-id')
      .then((r) => r.json())
      .then((data) => {
        if (data.clientId) {
          setGoogleClientId(data.clientId);
          const interval = setInterval(() => {
            if (window.google?.accounts?.id) {
              clearInterval(interval);
              window.google.accounts.id.initialize({
                client_id: data.clientId,
                callback: async (response) => {
                  setCarregando(true);
                  setErro('');
                  const res = await loginComGoogle({
                    credential: response.credential,
                    nickEscolhido: nick.trim() || undefined
                  });
                  setCarregando(false);
                  if (res.sucesso) {
                    tocarSucesso();
                    navigate('/perfil');
                  } else {
                    setErro(res.mensagem || 'Falha ao cadastrar com o Google.');
                  }
                }
              });

              const btnContainer = document.getElementById('google-btn-rendered-cadastro');
              if (btnContainer) {
                btnContainer.innerHTML = '';
                window.google.accounts.id.renderButton(btnContainer, {
                  type: 'standard',
                  theme: 'filled_black',
                  size: 'large',
                  text: 'signup_with',
                  shape: 'pill',
                  width: 320
                });
              }
            }
          }, 100);
          setTimeout(() => clearInterval(interval), 4000);
        }
      })
      .catch(() => {});
  }, [loginComGoogle, navigate, nick, tocarSucesso]);

  const handleCadastrarGoogle = () => {
    tocarClique();
    if (!googleClientId) {
      setErro('Configure seu GOOGLE_CLIENT_ID no arquivo .env para abrir a janela oficial do Google.');
      return;
    }
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const btn = document.querySelector('#google-btn-rendered-cadastro div[role=button]');
          if (btn) btn.click();
        }
      });
    }
  };

  const nickParaSkin = nick.trim() || 'steve';

  return (
    <div className="cadastro-page-container">
      <div className="cadastro-card">
        {/* Lado Esquerdo: Formulário */}
        <div className="cadastro-form-col">
          <div className="cadastro-header">
            <h1>Criar Conta Gratuita</h1>
            <p>Vincule seu Nick de Minecraft para resgatar prêmios diários e acompanhar seus pedidos.</p>
          </div>

          {erro && (
            <div className="cadastro-alert-erro" role="alert" aria-live="polite">
              <AlertCircle size={16} />
              <span>{erro}</span>
            </div>
          )}

          {/* Botão Oficial de Cadastro com Google */}
          <div className="auth-google-wrapper">
            <div
              id="google-btn-rendered-cadastro"
              className="auth-google-sdk-container"
              style={{ display: googleClientId ? 'flex' : 'none' }}
            />
            {!googleClientId && (
              <button
                type="button"
                className="btn-google-login"
                onClick={handleCadastrarGoogle}
                disabled={carregando}
              >
                <svg className="google-icon-svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Cadastrar Rápido com Google</span>
              </button>
            )}
          </div>

          <div className="auth-divider">
            <span>ou preencha os dados da conta</span>
          </div>

          <form onSubmit={handleSubmit} className="cadastro-form">
            <div className="cadastro-field">
              <div className="cadastro-label-row">
                <label htmlFor="cad-nick">Nick do Minecraft (In-Game)</label>
                <span className="label-tipo-pirata">Modo Livre / Pirata</span>
              </div>
              <div className="cadastro-input-wrapper">
                <input
                  id="cad-nick"
                  type="text"
                  placeholder="Ex: TeDabliukkkkk"
                  value={nick}
                  onChange={handleNickChange}
                  maxLength={16}
                  required
                />
              </div>

              {/* Status de validação do Nick */}
              {statusNick && (
                <div className={`status-nick-box ${statusNick.valido ? 'valido' : 'invalido'}`}>
                  {statusNick.valido ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span>{statusNick.mensagem || 'Nick válido no Modo Livre/Offline!'}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} className="text-rose-400" />
                      <span>{statusNick.erro}</span>
                    </>
                  )}
                </div>
              )}

              <small className="field-hint">
                Seu personagem receberá VIPs, Cash e prêmios do passe neste Nick.
              </small>
            </div>

            <div className="cadastro-field">
              <label htmlFor="cad-email">E-mail para Acesso &amp; Recibos</label>
              <div className="cadastro-input-wrapper">
                <input
                  id="cad-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="cadastro-campos-senha">
              <div className="cadastro-field">
                <label htmlFor="cad-pass">Senha</label>
                <div className="cadastro-input-wrapper password-wrapper">
                  <input
                    id="cad-pass"
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Mínimo 3 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn-toggle-eye"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="cadastro-field">
                <label htmlFor="cad-pass-confirm">Confirmar Senha</label>
                <div className="cadastro-input-wrapper password-wrapper">
                  <input
                    id="cad-pass-confirm"
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="Repita sua senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn-cadastro-submit"
              disabled={carregando}
              onClick={() => tocarClique()}
            >
              <span>{carregando ? 'Criando Conta...' : 'Cadastrar e Conectar'}</span>
            </button>
          </form>

          <div className="cadastro-footer">
            <span>Já possui uma conta criada?</span>
            <Link to="/login" onClick={() => tocarClique()}>
              <span>Fazer login agora</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Lado Direito: Preview da Skin em Tempo Real */}
        <div className="cadastro-skin-preview-col">
          <div className="skin-preview-box">
            <span className="skin-preview-label">
              <McIcon name="Compass" size={16} />
              <span>Personagem In-Game</span>
            </span>

            <div className="skin-figure-frame">
              <img
                src={`https://mc-heads.net/body/${nickParaSkin}/160`}
                alt={`Skin de ${nickParaSkin}`}
                className="skin-figure-img"
                onError={(e) => {
                  e.target.src = 'https://mc-heads.net/body/steve/160';
                }}
              />
            </div>

            <div className="skin-nick-badge">
              <img
                src={`https://mc-heads.net/avatar/${nickParaSkin}/20`}
                alt="Head"
                className="skin-head-mini"
              />
              <strong>{nick.trim() || 'Jogador Convidado'}</strong>
            </div>

            <div className="skin-tipo-status-pill">
              <span>● Modo Pirata / Livre Ativo</span>
            </div>

            <p className="skin-dica">
              {nick.trim()
                ? `Skin vinculada ao nick ${nick.trim()}! Qualquer compra ou recompensa no site será entregue a este jogador.`
                : 'Digite o seu Nick no campo ao lado para visualizar o seu personagem de Minecraft em tempo real.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
