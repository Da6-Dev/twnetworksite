import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import './LoginPage.css';

export default function LoginPage() {
  const { login, loginDemo, loginComGoogle, estaLogado } = useAuth();
  const { tocarClique, tocarSucesso } = useSound();
  const navigate = useNavigate();
  const location = useLocation();

  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [googleClientId, setGoogleClientId] = useState('');

  const deOndeVeio = location.state?.from || '/perfil';

  useEffect(() => {
    if (estaLogado) {
      navigate('/perfil');
    }
  }, [estaLogado, navigate]);

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
                  const res = await loginComGoogle({ credential: response.credential });
                  setCarregando(false);
                  if (res.sucesso) {
                    tocarSucesso();
                    navigate(deOndeVeio);
                  } else {
                    setErro(res.mensagem || 'Falha ao autenticar com o Google.');
                  }
                }
              });

              const btnContainer = document.getElementById('google-btn-rendered');
              if (btnContainer) {
                btnContainer.innerHTML = '';
                window.google.accounts.id.renderButton(btnContainer, {
                  type: 'standard',
                  theme: 'filled_black',
                  size: 'large',
                  text: 'continue_with',
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
  }, [loginComGoogle, navigate, deOndeVeio, tocarSucesso]);

  const handleLoginGoogle = () => {
    tocarClique();
    if (!googleClientId) {
      setErro('Configure seu GOOGLE_CLIENT_ID no arquivo .env para abrir a janela oficial do Google.');
      return;
    }
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const btn = document.querySelector('#google-btn-rendered div[role=button]');
          if (btn) btn.click();
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identificador.trim() || !senha.trim()) {
      setErro('Preencha seu Nick/E-mail e senha para continuar.');
      return;
    }

    setCarregando(true);
    setErro('');

    const res = await login(identificador, senha);
    setCarregando(false);

    if (res.sucesso) {
      tocarSucesso();
      navigate(deOndeVeio);
    } else {
      setErro(res.mensagem || 'Credenciais inválidas.');
    }
  };

  const handleDemo = (nickDemo) => {
    tocarClique();
    const ok = loginDemo(nickDemo);
    if (ok) {
      tocarSucesso();
      navigate(deOndeVeio);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Cabeçalho do Card */}
        <div className="auth-header">
          <h1>Entrar na sua Conta</h1>
          <p>Acesse seu perfil para recolher recompensas, evoluir no passe e gerenciar suas compras.</p>

          <div className="auth-modo-pirata-badge">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Suporta contas Originais &amp; Piratas (Modo Livre)</span>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="auth-alert-erro">
            <span>{erro}</span>
          </div>
        )}

        {/* Botão Oficial de Login com Google */}
        <div className="auth-google-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div id="google-btn-rendered" style={{ display: googleClientId ? 'flex' : 'none', justifyContent: 'center', width: '100%', minHeight: '44px' }} />
          {!googleClientId && (
            <button
              type="button"
              className="btn-google-login"
              onClick={handleLoginGoogle}
              disabled={carregando}
            >
              <svg className="google-icon-svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continuar com Google</span>
            </button>
          )}
        </div>

        {/* Divisor */}
        <div className="auth-divider">
          <span>ou entre com Nick / E-mail</span>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-id">Nick do Minecraft ou E-mail</label>
            <div className="auth-input-wrapper">
              <input
                id="login-id"
                type="text"
                placeholder="Ex: TeDabliukkkkk ou seu@email.com"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="login-pass">Senha</label>
            </div>
            <div className="auth-input-wrapper password-wrapper">
              <input
                id="login-pass"
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Sua senha secreta"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="btn-toggle-eye"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                title={mostrarSenha ? 'Ocultar senha' : 'Ver senha'}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-auth-submit"
            disabled={carregando}
            onClick={() => tocarClique()}
          >
            {carregando ? 'Verificando...' : 'Entrar na Conta'}
          </button>
        </form>

        {/* Divisor */}
        <div className="auth-divider">
          <span>ou teste rápido com contas demo</span>
        </div>

        {/* Contas Demo */}
        <div className="auth-demo-grid">
          <button
            type="button"
            className="btn-demo-chip"
            onClick={() => handleDemo('TeDabliukkkkk')}
          >
            <img src="https://mc-heads.net/avatar/TeDabliukkkkk/20" alt="Avatar" className="demo-avatar" />
            <div className="demo-texto">
              <strong>TeDabliukkkkk</strong>
              <small>Fundador &bull; VIP Deus</small>
            </div>
          </button>

          <button
            type="button"
            className="btn-demo-chip"
            onClick={() => handleDemo('Minerador_Pro')}
          >
            <img src="https://mc-heads.net/avatar/Minerador_Pro/20" alt="Avatar" className="demo-avatar" />
            <div className="demo-texto">
              <strong>Minerador_Pro</strong>
              <small>Veterano &bull; VIP Titã</small>
            </div>
          </button>
        </div>

        <div className="auth-footer-link">
          <span>Ainda não possui uma conta?</span>
          <Link to="/cadastro" onClick={() => tocarClique()}>
            <span>Criar conta gratuita</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
