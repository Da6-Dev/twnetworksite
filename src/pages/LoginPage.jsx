import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import McIcon from '../components/McIcon';
import './LoginPage.css';

export default function LoginPage() {
  const { login, loginDemo, loginComGoogle, estaLogado } = useAuth();
  const { tocarClique, tocarSucesso } = useSound();
  const navigate = useNavigate();
  const location = useLocation();

  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const nickGoogle = 'Davi_Player';

  useEffect(() => {
    if (estaLogado) {
      navigate('/perfil');
    }
  }, [estaLogado, navigate]);

  const deOndeVeio = location.state?.from || '/perfil';

  const handleLoginGoogle = async () => {
    tocarClique();
    setCarregando(true);
    setErro('');
    const res = await loginComGoogle({
      email: 'davipassos213@gmail.com',
      nome: 'Davi',
      nick: nickGoogle.trim() || 'Davi_Player'
    });
    setCarregando(false);
    if (res.sucesso) {
      tocarSucesso();
      navigate(deOndeVeio);
    } else {
      setErro(res.mensagem || 'Erro ao autenticar com o Google.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identificador.trim() || !senha.trim()) {
      setErro('Preencha seu Nick/E-mail e senha para continuar.');
      return;
    }

    setCarregando(true);
    setErro('');

    setTimeout(() => {
      const res = login(identificador, senha);
      setCarregando(false);
      if (res.sucesso) {
        tocarSucesso();
        navigate(deOndeVeio);
      } else {
        setErro(res.mensagem);
      }
    }, 400);
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
          <div className="auth-icon-badge">
            <McIcon name="Nether_Star" size={24} />
          </div>
          <h1>Entrar na <span className="highlight">TW Network</span></h1>
          <p>Acesse sua conta para recolher recompensas, evoluir no passe e gerenciar compras.</p>

          <div className="auth-modo-pirata-badge">
            <McIcon name="Compass" size={14} />
            <span>Suporta Contas Originais & Piratas (Offline Mode)</span>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="auth-alert-erro">
            <McIcon name="Barrier" size={16} />
            <span>{erro}</span>
          </div>
        )}

        {/* Botão de Login Rápido com Google */}
        <div className="auth-google-wrapper">
          <button
            type="button"
            className="btn-google-login"
            onClick={handleLoginGoogle}
            disabled={carregando}
          >
            <svg className="google-icon-svg" viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>
        </div>

        {/* Divisor */}
        <div className="auth-divider">
          <span>ou entre com Nick/E-mail</span>
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
            <div className="auth-input-wrapper">
              <input
                id="login-pass"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />
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

        {/* Botões de Acesso Rápido para Demonstração */}
        <div className="auth-demo-grid">
          <button
            type="button"
            className="btn-demo-account"
            onClick={() => handleDemo('TeDabliukkkkk')}
          >
            <img
              src="https://mc-heads.net/avatar/TeDabliukkkkk/24"
              alt="TeDabliukkkkk"
              className="demo-avatar"
            />
            <div className="demo-info">
              <strong>TeDabliukkkkk</strong>
              <small>Fundador • VIP Supremo</small>
            </div>
          </button>

          <button
            type="button"
            className="btn-demo-account"
            onClick={() => handleDemo('Minerador_Pro')}
          >
            <img
              src="https://mc-heads.net/avatar/Minerador_Pro/24"
              alt="Minerador_Pro"
              className="demo-avatar"
            />
            <div className="demo-info">
              <strong>Minerador_Pro</strong>
              <small>Veterano • VIP Titã</small>
            </div>
          </button>
        </div>

        {/* Rodapé do Card */}
        <div className="auth-footer">
          <span>Não possui uma conta ainda?</span>
          <Link to="/cadastro" onClick={() => tocarClique()}>
            Criar conta gratuita com Nick →
          </Link>
        </div>
      </div>
    </div>
  );
}
