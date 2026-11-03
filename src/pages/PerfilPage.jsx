import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Gift,
  ShoppingBag,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Lock,
  Crown,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  LogOut,
  RefreshCw,
  Sparkles,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useTheme } from '../context/useTheme';
import { useSound } from '../context/SoundContext';
import McIcon from '../components/McIcon';
import AnimatedTabs from '../components/ui/AnimatedTabs';
import './PerfilPage.css';

export default function PerfilPage() {
  const {
    usuario,
    estaLogado,
    logout,
    progresso,
    resgatarDiaCalendario,
    completarMissaoPasse,
    resgatarRecompensaPasse,
    ativarPasseVip,
    abrirModalVincular
  } = useAuth();

  const { pedidos, carregandoPedidos, recarregarPedidos } = useOrders();
  const { isDark, alternarTema } = useTheme();
  const { somHabilitado, alternarSom, tocarClique, tocarXP, tocarSucesso } = useSound();
  const navigate = useNavigate();

  // Referência do scroll horizontal da trilha do Passe de Batalha
  const trilhaScrollRef = useRef(null);

  const rolarTrilha = (direcao) => {
    tocarClique();
    if (trilhaScrollRef.current) {
      trilhaScrollRef.current.scrollBy({
        left: direcao === 'dir' ? 380 : -380,
        behavior: 'smooth'
      });
    }
  };

  // Aba inicial padrão: 'passe'
  const [abaAtiva, setAbaAtiva] = useState('passe');
  const [comandoCopiado, setComandoCopiado] = useState(null);
  const [ultimoComandoPasse, setUltimoComandoPasse] = useState(null);
  const [ultimoComandoCalendario, setUltimoComandoCalendario] = useState(null);

  // Efeito de confete para grandes conquistas (Dia 7, Nível 10, Ativação VIP)
  const dispararConfete = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#38bdf8', '#fbbf24', '#f43f5e']
    });
  };

  // Se não estiver logado, exibe tela para fazer login
  if (!estaLogado || !usuario) {
    return (
      <div className="perfil-nao-logado-container">
        <div className="perfil-login-prompt-card">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--mc-emerald)]/10 border border-[var(--mc-emerald)]/20 flex items-center justify-center">
            <McIcon name="Compass" size={40} />
          </div>
          <h2>Acesso Restrito ao Jogador</h2>
          <p>Você precisa estar conectado à sua conta para visualizar seu perfil, recolher recompensas diárias e evoluir no Passe de Batalha.</p>
          <div className="prompt-botoes">
            <Link to="/login" className="btn-ir-login" onClick={() => tocarClique()}>
              Fazer Login
            </Link>
            <Link to="/cadastro" className="btn-ir-cadastro" onClick={() => tocarClique()}>
              Criar Conta Gratuita
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pedidosDoUsuario = pedidos;

  // Dados do Calendário de 7 Dias
  const diasCalendario = [
    { dia: 1, titulo: 'Dia 1', premio: '500 Moedas', icone: 'Gold_Nugget', desc: 'Moedas iniciais para comércio' },
    { dia: 2, titulo: 'Dia 2', premio: '1x Chave Comum', icone: 'Tripwire_Hook', desc: 'Chave da Caixa Misteriosa' },
    { dia: 3, titulo: 'Dia 3', premio: 'Booster Mineração (30m)', icone: 'Golden_Pickaxe', desc: 'Venda de minérios em dobro' },
    { dia: 4, titulo: 'Dia 4', premio: '2.500 Moedas + Frascos XP', icone: 'Gold_Ingot', desc: 'Evolução de picareta e patentes' },
    { dia: 5, titulo: 'Dia 5', premio: '1x Chave Épica', icone: 'Diamond', desc: 'Itens raros e armaduras' },
    { dia: 6, titulo: 'Dia 6', premio: 'Booster Economia (1h)', icone: 'Fire_Charge', desc: 'Multiplicador global de fazendas' },
    { dia: 7, titulo: 'Dia 7 (SUPREMO)', premio: '1x Chave Suprema + 500 Cash + Tag [Natal]', icone: 'Nether_Star', destaque: true, desc: 'Grande premiação de fidelidade da semana!' },
  ];

  // Dados do Passe de Batalha (Níveis 1 a 10)
  const niveisPasse = [
    {
      nivel: 1,
      free: { nome: '1.000 Moedas', icone: 'Gold_Nugget' },
      vip: { nome: '5.000 Moedas + 1x Chave Mística', icone: 'Gold_Ingot' }
    },
    {
      nivel: 2,
      free: { nome: '1x Chave Comum', icone: 'Tripwire_Hook' },
      vip: { nome: '2x Chave Épica + Booster 2x', icone: 'Diamond' }
    },
    {
      nivel: 3,
      free: { nome: '2.500 Moedas', icone: 'Gold_Nugget' },
      vip: { nome: '15.000 Moedas + Spawner Esqueleto', icone: 'Bone' }
    },
    {
      nivel: 4,
      free: { nome: 'Booster Mineração (45m)', icone: 'Golden_Pickaxe' },
      vip: { nome: 'Booster Global (2h) + 1.000 Cash', icone: 'Fire_Charge' }
    },
    {
      nivel: 5,
      free: { nome: '1x Chave Rara', icone: 'Iron_Ingot' },
      vip: { nome: '1x Chave Suprema + Caixa Natalina', icone: 'Nether_Star' }
    },
    {
      nivel: 6,
      free: { nome: '5.000 Moedas', icone: 'Gold_Ingot' },
      vip: { nome: '25.000 Moedas + Kit Gladiador', icone: 'Diamond_Sword' }
    },
    {
      nivel: 7,
      free: { nome: '1x Caixa Misteriosa', icone: 'Chest' },
      vip: { nome: '2x Spawner de Blaze', icone: 'Blaze_Rod' }
    },
    {
      nivel: 8,
      free: { nome: '10.000 Moedas', icone: 'Gold_Ingot' },
      vip: { nome: '50.000 Moedas + 2.500 Cash', icone: 'Emerald' }
    },
    {
      nivel: 9,
      free: { nome: '1x Chave Épica', icone: 'Diamond' },
      vip: { nome: '1x Chave Divina + Tag [Noel]', icone: 'Totem_Of_Undying' }
    },
    {
      nivel: 10,
      destaque: true,
      free: { nome: '25.000 Moedas + Chave Suprema', icone: 'Nether_Star' },
      vip: { nome: '100k Moedas + 10k Cash + Pet Boneco de Neve + Tag [Gelo]', icone: 'Beacon' }
    }
  ];

  // Missões do Passe de Batalha
  const missoesPasse = [
    { id: 'm1', titulo: 'Minerador da Temporada', desc: 'Quebre 500 blocos de carvão, ferro ou diamante em qualquer mina.', xp: 350, icone: 'Golden_Pickaxe' },
    { id: 'm2', titulo: 'Comerciante Ativo', desc: 'Venda R$ 50.000 em colheitas no /mercado do servidor.', xp: 400, icone: 'Gold_Ingot' },
    { id: 'm3', titulo: 'Gladiador da Arena', desc: 'Derrote 25 monstros na mina PvP da Fortaleza do Nether.', xp: 450, icone: 'Diamond_Sword' },
    { id: 'm4', titulo: 'Conexão com Discord', desc: 'Vincule seu nick no Discord oficial da rede TW.', xp: 300, icone: 'Compass' },
    { id: 'm5', titulo: 'Votante do Servidor', desc: 'Vote na TW Network na listagem pública do TopCraft.', xp: 500, icone: 'Emerald' },
    { id: 'm6', titulo: 'Fidelidade de 3 Dias', desc: 'Faça login no servidor em 3 dias consecutivos nesta semana.', xp: 600, icone: 'Nether_Star' },
  ];

  // Estado seguro do progresso do jogador
  const streak = progresso?.streak || { diaAtual: 1, diasColetados: [], codigosResgate: {} };
  const passe = progresso?.passe || {
    nivel: 2,
    xp: 350,
    xpMaxNivel: 500,
    temVipPasse: usuario?.patenteVip && usuario.patenteVip !== 'Nenhum',
    recompensasFreeColetadas: [],
    recompensasVipColetadas: [],
    missoesConcluidas: []
  };

  const proximoDiaParaColetar = diasCalendario.find(d => !streak.diasColetados.includes(d.dia))?.dia || null;

  const copiarComando = (cmd, id, mensagemFeedback = 'Comando copiado!') => {
    tocarClique();
    navigator.clipboard.writeText(cmd);
    setComandoCopiado(id);
    toast.success(mensagemFeedback);
    setTimeout(() => {
      setComandoCopiado(null);
    }, 2000);
  };

  const handleLogout = () => {
    tocarClique();
    logout();
    toast.info('Você saiu da sua conta.');
    navigate('/');
  };

  // Ação de Resgatar Dia no Calendário
  const handleResgatarCalendario = (dia) => {
    tocarSucesso();
    const resultado = resgatarDiaCalendario(dia);
    if (resultado.sucesso) {
      if (dia === 7) dispararConfete();
      setUltimoComandoCalendario(resultado.comando);
      toast.success(`🎁 Recompensa do Dia ${dia} resgatada com sucesso para ${usuario.nick}!`);
    }
  };

  // Ação de Coletar Recompensa do Passe
  const handleColetarPasse = (nivel, tipo) => {
    tocarSucesso();
    const resultado = resgatarRecompensaPasse(nivel, tipo);
    if (resultado.sucesso) {
      if (nivel === 10) dispararConfete();
      setUltimoComandoPasse(resultado.comando);
      toast.success(`⭐ Recompensa ${tipo === 'vip' ? 'VIP' : 'Gratuita'} do Nível ${nivel} resgatada!`);
    }
  };

  // Ação de Completar Missão do Passe
  const handleCompletarMissao = (missaoId, xpGanho) => {
    tocarXP();
    const resultado = completarMissaoPasse(missaoId, xpGanho);
    if (resultado?.subiuNivel) {
      tocarSucesso();
      if (resultado.novoNivel >= 10) dispararConfete();
      toast.success(`🎉 PARABÉNS! Você subiu para o NÍVEL ${resultado.novoNivel} no Passe de Batalha!`);
    } else {
      toast.info(`+${xpGanho} XP adicionado ao seu Passe de Batalha!`);
    }
  };

  // Ação de Desbloquear Passe VIP Instantâneo
  const handleAtivarVipPasse = () => {
    tocarSucesso();
    dispararConfete();
    ativarPasseVip();
    toast.success(`👑 Passe VIP ativado para a conta ${usuario.nick}! Todas as recompensas douradas estão liberadas.`);
  };

  // Cálculo da barra de progresso de XP
  const percentualXp = Math.min(100, Math.round((passe.xp / passe.xpMaxNivel) * 100));

  const abasDisponiveis = [
    { id: 'passe', label: 'Passe de Batalha', icon: <Trophy size={16} /> },
    { id: 'recompensas', label: 'Recompensas Diárias', icon: <Gift size={16} /> },
    { id: 'pedidos', label: 'Meus Pedidos', icon: <ShoppingBag size={16} />, badge: pedidosDoUsuario.length > 0 ? pedidosDoUsuario.length : null },
    { id: 'conta', label: 'Minha Conta In-Game', icon: <ShieldCheck size={16} /> },
    { id: 'configuracoes', label: 'Configurações', icon: <Settings size={16} /> },
  ];

  return (
    <div className="perfil-page-container">
      {/* Banner de alerta caso o nick do Minecraft ainda não tenha sido vinculado */}
      {!usuario.nickVinculado && (
        <div className="perfil-alerta-vincular-container">
          <div className="perfil-alerta-vincular-card">
            <div className="perfil-alerta-icon-badge">
              <McIcon name="Name_Tag" size={26} />
            </div>
            <div className="perfil-alerta-conteudo">
              <strong>Vincule seu Nickname do Minecraft</strong>
              <p>Você entrou com uma conta Google. Para que seus VIPs, Cash e caixas sejam entregues no servidor, informe seu Nickname exato no jogo.</p>
            </div>
            <button
              type="button"
              className="btn-perfil-alerta-acao"
              onClick={() => {
                tocarClique();
                abrirModalVincular();
              }}
            >
              <McIcon name="Emerald" size={16} />
              Vincular Agora
            </button>
          </div>
        </div>
      )}

      {/* Cabeçalho do Perfil */}
      <section className="perfil-hero-header">
        <div className="perfil-hero-content">
          <div className="perfil-avatar-col">
            <div className="perfil-avatar-frame">
              <img
                src={`https://mc-heads.net/avatar/${usuario.nick}/80`}
                alt={usuario.nick}
                className="perfil-avatar-img"
              />
            </div>
          </div>

          <div className="perfil-info-col">
            <div className="perfil-tag-row">
              <span className="badge-cargo">
                <McIcon name="Nether_Star" size={14} />
                {usuario.cargo || 'Jogador'}
              </span>
              {(usuario.patenteVip && usuario.patenteVip !== 'Nenhum') || passe.temVipPasse ? (
                <span className="badge-vip-ativa">
                  <Crown size={14} className="text-amber-400" />
                  {usuario.patenteVip !== 'Nenhum' ? usuario.patenteVip : 'Passe VIP Ativo'}
                </span>
              ) : (
                <span className="badge-free">
                  <McIcon name="Compass" size={14} />
                  Membro Free
                </span>
              )}
              {usuario.nickVinculado ? (
                <span className="badge-nick-status vinculado">
                  <Check size={13} />
                  Nick Vinculado
                </span>
              ) : (
                <span 
                  className="badge-nick-status pendente"
                  onClick={() => {
                    tocarClique();
                    abrirModalVincular();
                  }}
                  title="Clique para vincular seu Nick do Minecraft"
                >
                  <McIcon name="Barrier" size={13} />
                  Nick Pendente
                </span>
              )}
            </div>

            <div className="perfil-nick-linha">
              <h1 className="perfil-nick-titulo">{usuario.nick}</h1>
              <button
                type="button"
                className="btn-acao-alterar-nick"
                onClick={() => {
                  tocarClique();
                  abrirModalVincular();
                }}
                title="Alterar ou vincular Nick do Minecraft"
              >
                <McIcon name="Name_Tag" size={14} />
                <span>{usuario.nickVinculado ? 'Alterar Nick' : 'Vincular Nick'}</span>
              </button>
            </div>
            <p className="perfil-email-sub">{usuario.email}</p>

            <div className="perfil-kpi-strip">
              <div className="kpi-item">
                <small>Nível do Passe:</small>
                <strong>Nível {passe.nivel} / 10</strong>
              </div>
              <div className="kpi-divisor"></div>
              <div className="kpi-item">
                <small>Streak Diário:</small>
                <strong>{streak.diasColetados.length} de 7 dias</strong>
              </div>
              <div className="kpi-divisor"></div>
              <div className="kpi-item">
                <small>Total de Pedidos:</small>
                <strong>{pedidosDoUsuario.length} {pedidosDoUsuario.length === 1 ? 'compra' : 'compras'}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navegador de Abas com Framer Motion AnimatedTabs */}
      <div className="perfil-abas-container">
        <AnimatedTabs
          layoutId="perfilTabIndicator"
          tabs={abasDisponiveis}
          activeTab={abaAtiva}
          onChange={(id) => {
            tocarClique();
            setAbaAtiva(id);
          }}
        />
      </div>

      {/* Conteúdo Dinâmico das Abas */}
      <div className="perfil-conteudo-wrapper">
        {/* ========================================================
            ABA 1: PASSE DE BATALHA (FREE VS VIP + MISSÕES)
            ======================================================== */}
        {abaAtiva === 'passe' && (
          <div className="perfil-passe-box fade-in">
            {/* Header / Banner do Passe de Batalha */}
            <div className="passe-topo-card">
              <div className="passe-topo-info">
                <div className="passe-topo-titulo">
                  <span className="passe-temporada-tag">Temporada de Natal 2026</span>
                  <h2>Passe de Batalha</h2>
                  <p>Complete missões in-game ou no site para acumular XP, subir de nível e desbloquear recompensas da <strong>Trilha Grátis (em cima)</strong> e da <strong>Trilha VIP (em baixo)</strong>.</p>
                </div>

                <div className="passe-progresso-bloco">
                  <div className="passe-nivel-emblema">
                    <McIcon name="Nether_Star" size={28} />
                    <div className="nivel-num-col">
                      <small>NÍVEL ATUAL</small>
                      <strong>{passe.nivel}</strong>
                    </div>
                  </div>

                  <div className="passe-barra-col">
                    <div className="barra-legenda">
                      <span>Progresso para Nível {Math.min(10, passe.nivel + 1)}</span>
                      <span className="tabular-nums font-mono">{passe.nivel >= 10 ? 'NÍVEL MÁXIMO' : `${passe.xp} / ${passe.xpMaxNivel} XP`}</span>
                    </div>
                    <div className="barra-trilha-bg">
                      <div
                        className="barra-trilha-fill"
                        style={{ width: `${passe.nivel >= 10 ? 100 : percentualXp}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status do Passe VIP */}
              <div className="passe-vip-status-card">
                {passe.temVipPasse ? (
                  <div className="status-vip-ativo">
                    <div className="vip-ativo-header">
                      <Crown size={22} className="text-amber-400" />
                      <strong>Passe Premium VIP Ativo</strong>
                    </div>
                    <p>Sua conta tem acesso liberado para coletar todos os itens da trilha dourada VIP até o Nível 10!</p>
                  </div>
                ) : (
                  <div className="status-vip-bloqueado">
                    <div className="vip-bloqueado-header">
                      <Lock size={20} className="text-red-400" />
                      <strong>Trilha VIP Bloqueada</strong>
                    </div>
                    <p>Você está na trilha gratuita. Ative o Passe VIP para desbloquear Chaves Supremas, Cash e Cosméticos.</p>
                    <button
                      type="button"
                      className="btn-desbloquear-passe-vip"
                      onClick={handleAtivarVipPasse}
                    >
                      <Sparkles size={16} />
                      <span>Ativar Passe VIP Instantâneo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Aviso de Comando Gerado para o Passe */}
            {ultimoComandoPasse && (
              <div className="passe-comando-sucesso-box">
                <div className="comando-sucesso-texto">
                  <Check size={20} className="text-emerald-400 shrink-0" />
                  <div>
                    <strong>Recompensa liberada para entrega in-game!</strong>
                    <p>Copie o comando abaixo e digite no servidor com o nick <strong>{usuario.nick}</strong>:</p>
                    <code>{ultimoComandoPasse}</code>
                  </div>
                </div>
                <button
                  type="button"
                  className={`btn-copiar-cmd-perfil ${comandoCopiado === 'passe' ? 'sucesso' : ''}`}
                  onClick={() => copiarComando(ultimoComandoPasse, 'passe', 'Comando do Passe copiado!')}
                >
                  {comandoCopiado === 'passe' ? <Check size={15} /> : <Copy size={15} />}
                  <span>{comandoCopiado === 'passe' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            )}

            {/* Trilha do Passe de Batalha com Scroll Horizontal */}
            <div className="passe-trilha-secao">
              <div className="trilha-secao-cabecalho">
                <div className="trilha-secao-titulos">
                  <span className="trilha-badge-topo">
                    <Trophy size={14} className="text-amber-400 inline mr-1.5" />
                    Passe de Batalha
                  </span>
                  <h3>Trilha da Temporada (Níveis 1 ao 10)</h3>
                  <p>
                    A <strong>Trilha Grátis fica em cima</strong> e a <strong>Trilha VIP fica em baixo</strong>. Role horizontalmente para ver todos os níveis!
                  </p>
                </div>

                <div className="trilha-topo-controles">
                  <div className="trilha-legendas">
                    <span className="legenda-item free">● Grátis (Em Cima)</span>
                    <span className="legenda-item vip">★ VIP (Em Baixo)</span>
                  </div>

                  <div className="trilha-botoes-scroll">
                    <button
                      type="button"
                      className="btn-scroll-trilha"
                      onClick={() => rolarTrilha('esq')}
                      title="Rolar níveis para a esquerda"
                      aria-label="Rolar para a esquerda"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      className="btn-scroll-trilha"
                      onClick={() => rolarTrilha('dir')}
                      title="Rolar níveis para a direita"
                      aria-label="Rolar para a direita"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Viewport com Scroll Horizontal */}
              <div className="passe-scroll-viewport" ref={trilhaScrollRef}>
                <div className="passe-scroll-content">
                  {/* Coluna Fixa de Rótulos das Trilhas */}
                  <div className="trilha-rotulos-coluna">
                    <div className="rotulo-bloco rotulo-gratis">
                      <McIcon name="Chest" size={20} />
                      <div>
                        <strong>Grátis</strong>
                        <small>Em Cima</small>
                      </div>
                    </div>

                    <div className="rotulo-bloco rotulo-nivel">
                      <Award size={16} className="text-emerald-400" />
                      <span>Nível</span>
                    </div>

                    <div className="rotulo-bloco rotulo-vip">
                      <Crown size={20} className="text-amber-400" />
                      <div>
                        <strong>VIP</strong>
                        <small>Em Baixo</small>
                      </div>
                    </div>
                  </div>

                  {/* Níveis 1 a 10 dispostos horizontalmente lado a lado */}
                  <div className="passe-niveis-horizontal-track">
                    {niveisPasse.map((item) => {
                      const nivelAlcancado = passe.nivel >= item.nivel;
                      const freeColetado = passe.recompensasFreeColetadas.includes(item.nivel);
                      const vipColetado = passe.recompensasVipColetadas.includes(item.nivel);

                      return (
                        <div
                          key={item.nivel}
                          className={`trilha-nivel-coluna ${nivelAlcancado ? 'alcancado' : 'bloqueado'} ${item.destaque ? 'destaque-final' : ''}`}
                        >
                          {/* 1. EM CIMA: TRILHA GRÁTIS */}
                          <div className={`trilha-slot-card gratis ${freeColetado ? 'coletado' : ''}`}>
                            <div className="slot-tipo-tag gratis">
                              <span>GRÁTIS</span>
                            </div>
                            <div className="slot-item-icon-box">
                              <McIcon name={item.free.icone} size={30} />
                            </div>
                            <div className="slot-item-nome-txt">{item.free.nome}</div>

                            <div className="slot-item-action-area">
                              {freeColetado ? (
                                <span className="badge-coletado-status-mini">
                                  <Check size={12} /> Coletado
                                </span>
                              ) : nivelAlcancado ? (
                                <button
                                  type="button"
                                  className="btn-coletar-trilha-btn gratis"
                                  onClick={() => handleColetarPasse(item.nivel, 'free')}
                                >
                                  Coletar
                                </button>
                              ) : (
                                <span className="badge-bloqueado-trilha-mini">Nível {item.nivel}</span>
                              )}
                            </div>
                          </div>

                          {/* 2. NO MEIO: MARCADOR DE NÍVEL */}
                          <div className={`trilha-marcador-divisor ${nivelAlcancado ? 'liberado' : 'bloqueado'}`}>
                            <div className="linha-conector esq"></div>
                            <div className="badge-circulo-nivel">
                              <span className="font-mono">{item.nivel}</span>
                            </div>
                            <div className="linha-conector dir"></div>
                          </div>
                          <div className="trilha-marcador-rotulo">
                            <strong>{item.destaque ? 'Nível 10 (MAX)' : `Nível ${item.nivel}`}</strong>
                            <small>{nivelAlcancado ? 'Liberado' : 'Bloqueado'}</small>
                          </div>

                          {/* 3. EM BAIXO: TRILHA VIP */}
                          <div className={`trilha-slot-card vip ${vipColetado ? 'coletado' : ''}`}>
                            <div className="slot-tipo-tag vip">
                              <Crown size={11} className="inline mr-1" />
                              <span>VIP</span>
                            </div>
                            <div className="slot-item-icon-box vip">
                              <McIcon name={item.vip.icone} size={30} />
                            </div>
                            <div className="slot-item-nome-txt vip">{item.vip.nome}</div>

                            <div className="slot-item-action-area">
                              {vipColetado ? (
                                <span className="badge-coletado-status-mini vip">
                                  <Check size={12} /> VIP Coletado
                                </span>
                              ) : nivelAlcancado && passe.temVipPasse ? (
                                <button
                                  type="button"
                                  className="btn-coletar-trilha-btn vip"
                                  onClick={() => handleColetarPasse(item.nivel, 'vip')}
                                >
                                  <Sparkles size={13} />
                                  <span>Coletar VIP</span>
                                </button>
                              ) : nivelAlcancado && !passe.temVipPasse ? (
                                <button
                                  type="button"
                                  className="btn-requer-vip-trilha-btn"
                                  onClick={handleAtivarVipPasse}
                                  title="Ativar Passe VIP para coletar"
                                >
                                  <Lock size={13} />
                                  <span>Requer VIP</span>
                                </button>
                              ) : (
                                <span className="badge-bloqueado-trilha-mini vip">
                                  <Lock size={12} /> Nível {item.nivel}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Missões Diárias & Semanais de XP */}
            <div className="passe-missoes-secao">
              <div className="missoes-secao-cabecalho">
                <div className="missoes-titulo-row">
                  <div className="w-10 h-10 rounded-xl bg-[var(--mc-emerald)]/10 border border-[var(--mc-emerald)]/20 flex items-center justify-center">
                    <McIcon name="Compass" size={22} />
                  </div>
                  <div>
                    <h3>Missões da Temporada para Acumular XP</h3>
                    <p>Complete as tarefas abaixo para avançar mais rápido na trilha do Passe de Batalha.</p>
                  </div>
                </div>
                <div className="missoes-resumo-tag">
                  {passe.missoesConcluidas.length} de {missoesPasse.length} Concluídas
                </div>
              </div>

              <div className="missoes-cards-grid">
                {missoesPasse.map((missao) => {
                  const concluida = passe.missoesConcluidas.includes(missao.id);

                  return (
                    <div
                      key={missao.id}
                      className={`missao-card ${concluida ? 'concluida' : ''}`}
                    >
                      <div className="missao-icone-box">
                        <McIcon name={missao.icone} size={28} />
                      </div>

                      <div className="missao-info-col">
                        <div className="missao-topo-meta">
                          <h4>{missao.titulo}</h4>
                          <span className="missao-xp-badge">+{missao.xp} XP</span>
                        </div>
                        <p>{missao.desc}</p>
                      </div>

                      <div className="missao-botao-col">
                        {concluida ? (
                          <span className="badge-missao-feita">
                            <Check size={14} /> Concluída
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn-completar-missao"
                            onClick={() => handleCompletarMissao(missao.id, missao.xp)}
                          >
                            <Sparkles size={14} />
                            <span>Completar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ABA 2: RECOMPENSAS DIÁRIAS (CALENDÁRIO 7 DIAS)
            ======================================================== */}
        {abaAtiva === 'recompensas' && (
          <div className="perfil-calendario-box fade-in">
            {/* Topo do Calendário */}
            <div className="calendario-hero-topo">
              <div className="calendario-info-bloco">
                <div className="calendario-tag">
                  <Gift size={15} className="text-emerald-400" />
                  <span>Sequência de Login Contínuo</span>
                </div>
                <h2>Calendário Diário de 7 Dias</h2>
                <p>
                  Recompensas registradas exclusivamente no Nick <strong>{usuario.nick}</strong>. Faça login todos os dias para acumular bônus progressivos até a Chave Suprema no Dia 7!
                </p>
              </div>

              <div className="calendario-streak-counter">
                <span className="streak-num font-mono">{streak.diasColetados.length}/7</span>
                <span className="streak-label">Dias Resgatados Nesta Semana</span>
                <div className="streak-progresso-mini">
                  <div
                    className="streak-fill"
                    style={{ width: `${(streak.diasColetados.length / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Aviso de Comando Gerado para Recompensa Diária */}
            {ultimoComandoCalendario && (
              <div className="calendario-comando-box">
                <div className="comando-sucesso-texto">
                  <Check size={20} className="text-emerald-400 shrink-0" />
                  <div>
                    <strong>Presente do dia registrado com sucesso!</strong>
                    <p>Digite no console do jogo para receber seus itens no inventário:</p>
                    <code>{ultimoComandoCalendario}</code>
                  </div>
                </div>
                <button
                  type="button"
                  className={`btn-copiar-cmd-perfil ${comandoCopiado === 'calendario' ? 'sucesso' : ''}`}
                  onClick={() => copiarComando(ultimoComandoCalendario, 'calendario', 'Código diário copiado!')}
                >
                  {comandoCopiado === 'calendario' ? <Check size={15} /> : <Copy size={15} />}
                  <span>{comandoCopiado === 'calendario' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            )}

            {/* Grid dos 7 Dias */}
            <div className="calendario-dias-grid">
              {diasCalendario.map((item) => {
                const jaColetado = streak.diasColetados.includes(item.dia);
                const prontoParaColetar = item.dia === proximoDiaParaColetar;
                const codigoGerado = streak.codigosResgate?.[item.dia];

                return (
                  <div
                    key={item.dia}
                    className={`calendario-dia-card ${jaColetado ? 'coletado' : ''} ${prontoParaColetar ? 'pronto' : ''} ${item.destaque ? 'destaque-supremo' : ''}`}
                  >
                    <div className="dia-card-topo">
                      <span className="dia-titulo-tag">{item.titulo}</span>
                      {jaColetado ? (
                        <span className="dia-badge-status coletado">
                          <Check size={12} /> Coletado
                        </span>
                      ) : prontoParaColetar ? (
                        <span className="dia-badge-status pronto">Disponível</span>
                      ) : (
                        <span className="dia-badge-status bloqueado">Bloqueado</span>
                      )}
                    </div>

                    <div className="dia-card-icone">
                      <McIcon name={item.icone} size={42} />
                    </div>

                    <div className="dia-card-premio">
                      <strong>{item.premio}</strong>
                      <p>{item.desc}</p>
                    </div>

                    <div className="dia-card-acao">
                      {jaColetado ? (
                        <button
                          type="button"
                          className="btn-dia-coletado"
                          onClick={() => {
                            if (codigoGerado) {
                              copiarComando(`/recompensa resgatar ${codigoGerado}`, `dia-${item.dia}`, 'Comando de resgate copiado!');
                            } else {
                              tocarClique();
                              toast.info(`Dia ${item.dia} já foi coletado.`);
                            }
                          }}
                        >
                          {comandoCopiado === `dia-${item.dia}` ? <Check size={14} /> : <Check size={14} />}
                          <span>{comandoCopiado === `dia-${item.dia}` ? 'Código Copiado!' : 'Já Coletado'}</span>
                        </button>
                      ) : prontoParaColetar ? (
                        <button
                          type="button"
                          className="btn-dia-resgatar-hoje"
                          onClick={() => handleResgatarCalendario(item.dia)}
                        >
                          <Gift size={16} />
                          <span>Resgatar Hoje!</span>
                        </button>
                      ) : (
                        <span className="dia-aguardando-label">
                          Aguarde o Dia {item.dia}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            ABA 3: MEUS PEDIDOS & ATIVAÇÃO
            ======================================================== */}
        {abaAtiva === 'pedidos' && (
          <div className="perfil-pedidos-box fade-in">
            <div className="secao-titulo-row">
              <div>
                <h2>Histórico de Compras & Entregas</h2>
                <p>Pedidos sincronizados em tempo real com o banco de dados para <strong>{usuario.nick}</strong>.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-atualizar-pedidos"
                  onClick={() => {
                    tocarClique();
                    recarregarPedidos();
                    toast.success('Status dos pedidos atualizado!');
                  }}
                  disabled={carregandoPedidos}
                >
                  <RefreshCw size={14} className={carregandoPedidos ? 'animate-spin' : ''} />
                  <span>{carregandoPedidos ? 'Sincronizando...' : 'Atualizar Status'}</span>
                </button>
                <Link to="/loja" className="btn-comprar-mais" onClick={() => tocarClique()}>
                  <ShoppingBag size={16} />
                  <span>Explorar Loja VIP</span>
                </Link>
              </div>
            </div>

            {pedidosDoUsuario.length > 0 ? (
              <div className="perfil-pedidos-grid">
                {pedidosDoUsuario.map((pedido) => {
                  const statusKey = String(pedido.status || 'pendente').toLowerCase();
                  const isAprovado = statusKey === 'aprovado' || statusKey === 'entregue';
                  const isPendente = statusKey === 'pendente';
                  const isRecusado = statusKey === 'recusado';

                  return (
                    <div key={pedido.id} className={`perfil-pedido-card ${statusKey}`}>
                      <div className="pedido-topo-linha">
                        <span className="pedido-id-badge font-mono">{pedido.id}</span>
                        <span className={`pedido-status-badge ${statusKey}`}>
                          {isAprovado ? (
                            <Check size={14} />
                          ) : isRecusado ? (
                            <McIcon name="Barrier" size={14} />
                          ) : (
                            <RefreshCw size={14} />
                          )}
                          {pedido.statusTexto || (isAprovado ? 'Pagamento Aprovado' : (isRecusado ? 'Recusado' : 'Aguardando Pagamento'))}
                        </span>
                      </div>

                      <div className="pedido-item-principal">
                        <div className="pedido-mc-icon-frame">
                          <McIcon name={pedido.mcIcon || 'Emerald'} size={32} />
                        </div>
                        <div className="pedido-info-texto">
                          <h3>{pedido.pacote}</h3>
                          <div className="pedido-meta-row">
                            <span>Valor: <strong>{pedido.valor}</strong></span>
                            <span>·</span>
                            <span>Data: <strong>{pedido.data}</strong></span>
                            <span>·</span>
                            <span>Método: <strong>{pedido.metodoTexto || pedido.metodo}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Box de Ação para Pix Pendente */}
                      {isPendente && pedido.pixCopiaCola && (
                        <div className="pedido-pendente-box">
                          <div className="pedido-pendente-info">
                            <McIcon name="Gold_Ingot" size={18} />
                            <div>
                              <strong>Aguardando Pagamento Pix</strong>
                              <p>Seu código Pix Copia e Cola ainda está ativo para pagamento no app do banco:</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-copiar-pix-pedido"
                            onClick={() => copiarComando(pedido.pixCopiaCola, `pix-${pedido.id}`, 'Código Pix Copia e Cola copiado!')}
                          >
                            {comandoCopiado === `pix-${pedido.id}` ? <Check size={15} /> : <Copy size={15} />}
                            <span>{comandoCopiado === `pix-${pedido.id}` ? 'Código Copiado!' : 'Copiar Código Pix'}</span>
                          </button>
                        </div>
                      )}

                      {/* Box de Ativação para Pedidos Pagos */}
                      {isAprovado && pedido.comando && (
                        <div className="pedido-comando-area">
                          <div className="comando-label-box">
                            <small>Comando de Ativação In-Game:</small>
                            <code>{pedido.comando}</code>
                          </div>
                          <button
                            type="button"
                            className={`btn-copiar-cmd-perfil ${comandoCopiado === pedido.id ? 'sucesso' : ''}`}
                            onClick={() => copiarComando(pedido.comando, pedido.id, 'Comando de ativação copiado!')}
                            title="Copiar comando de ativação"
                          >
                            {comandoCopiado === pedido.id ? <Check size={15} /> : <Copy size={15} />}
                            <span>{comandoCopiado === pedido.id ? 'Copiado!' : 'Copiar'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="pedidos-vazio-card">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto mb-4">
                  <McIcon name="Chest" size={38} />
                </div>
                <h3>Nenhum pedido efetuado ainda</h3>
                <p>Você ainda não realizou compras na loja com o Nick <strong>{usuario.nick}</strong>.</p>
                <Link to="/loja" className="btn-ir-loja-vazio" onClick={() => tocarClique()}>
                  <ShoppingBag size={16} />
                  <span>Ver Pacotes VIP Disponíveis</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            ABA 4: MINHA CONTA IN-GAME
            ======================================================== */}
        {abaAtiva === 'conta' && (
          <div className="perfil-conta-box fade-in">
            <div className="secao-titulo-row">
              <div>
                <h2>Informações da Conta do Minecraft</h2>
                <p>Verifique o vínculo do seu personagem com a infraestrutura da TW Network.</p>
              </div>
            </div>

            <div className="conta-cards-grid">
              <div className="conta-info-card">
                <div className="conta-card-header">
                  <div className="w-9 h-9 rounded-lg bg-[var(--mc-emerald)]/10 border border-[var(--mc-emerald)]/20 flex items-center justify-center">
                    <McIcon name="Grass_Block" size={20} />
                  </div>
                  <h3>Personagem Vinculado</h3>
                </div>
                <div className="conta-avatar-destaque">
                  <img
                    src={`https://mc-heads.net/body/${usuario.nick}/120`}
                    alt={usuario.nick}
                    className="avatar-corpo-img"
                  />
                  <div className="avatar-dados">
                    <h4>{usuario.nick}</h4>
                    <span className="status-autenticado">
                      <Check size={13} className="inline mr-1" />
                      Conta Ativa & Sincronizada
                    </span>
                    <p>Qualquer compra na loja ou recompensa do passe é creditada neste nick.</p>
                  </div>
                </div>
              </div>

              <div className="conta-info-card">
                <div className="conta-card-header">
                  <div className="w-9 h-9 rounded-lg bg-[var(--mc-ice)]/10 border border-[var(--mc-ice)]/20 flex items-center justify-center">
                    <McIcon name="Compass" size={20} />
                  </div>
                  <h3>Como Conectar no Servidor</h3>
                </div>
                <p>Utilize o endereço oficial da rede para acessar os servidores:</p>
                <div className="ip-destaque-box">
                  <code>TWNetwork.com.br</code>
                  <button
                    type="button"
                    className="btn-copiar-ip-perfil"
                    onClick={() => {
                      copiarComando('TWNetwork.com.br', 'ip-server', 'IP TWNetwork.com.br copiado!');
                    }}
                  >
                    {comandoCopiado === 'ip-server' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{comandoCopiado === 'ip-server' ? 'Copiado!' : 'Copiar IP'}</span>
                  </button>
                </div>
                <ul className="instrucoes-servidor">
                  <li>Versão recomendada: <strong>1.8 até 1.20+</strong></li>
                  <li>Digite <code>/recompensas</code> para conferir entregas pendentes.</li>
                  <li>Digite <code>/passe</code> in-game para visualizar sua temporada.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ABA 5: CONFIGURAÇÕES DO PERFIL (TEMA DIA/NOITE & SOM/MUDO)
            ======================================================== */}
        {abaAtiva === 'configuracoes' && (
          <div className="perfil-configs-box fade-in">
            <div className="secao-titulo-row">
              <div>
                <h2>Configurações do Perfil & Interface</h2>
                <p>Personalize sua experiência visual e sonora na TW Network. Suas escolhas ficam salvas no seu navegador.</p>
              </div>
            </div>

            <div className="configs-secoes-grid">
              {/* Seção 1: Tema da Interface */}
              <div className="config-card">
                <div className="config-card-header">
                  <div className="w-9 h-9 rounded-lg bg-[var(--mc-gold)]/10 border border-[var(--mc-gold)]/20 flex items-center justify-center">
                    <Sun size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h3>Tema da Interface</h3>
                    <small>Escolha entre o Modo Escuro profundo ou o Modo Claro nevado</small>
                  </div>
                </div>

                <div className="tema-opcoes-grid">
                  <button
                    type="button"
                    className={`btn-opcao-tema ${isDark ? 'selecionado' : ''}`}
                    onClick={() => {
                      if (!isDark) alternarTema();
                      tocarClique();
                    }}
                  >
                    <div className="tema-preview escuro">
                      <Moon size={20} className="text-indigo-300" />
                    </div>
                    <div className="tema-texto">
                      <strong>Noite Polar (Escuro)</strong>
                      <small>Contrastes profundos e brilho suave de minérios</small>
                    </div>
                    {isDark && (
                      <span className="check-ativo">
                        <Check size={14} /> Ativo
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`btn-opcao-tema ${!isDark ? 'selecionado' : ''}`}
                    onClick={() => {
                      if (isDark) alternarTema();
                      tocarClique();
                    }}
                  >
                    <div className="tema-preview claro">
                      <Sun size={20} className="text-amber-500" />
                    </div>
                    <div className="tema-texto">
                      <strong>Dia de Neve (Claro)</strong>
                      <small>Tons claros, máxima legibilidade e cartões translúcidos</small>
                    </div>
                    {!isDark && (
                      <span className="check-ativo">
                        <Check size={14} /> Ativo
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Seção 2: Efeitos Sonoros de Minecraft */}
              <div className="config-card">
                <div className="config-card-header">
                  <div className="w-9 h-9 rounded-lg bg-[var(--mc-redstone)]/10 border border-[var(--mc-redstone)]/20 flex items-center justify-center">
                    <Volume2 size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3>Efeitos Sonoros de Minecraft</h3>
                    <small>Sons sintetizados via Web Audio API (sem travamentos)</small>
                  </div>
                </div>

                <div className="audio-controle-linha">
                  <div className="audio-info">
                    <strong>{somHabilitado ? 'Efeitos Sonoros Ativados' : 'Efeitos Sonoros Silenciados (Mudo)'}</strong>
                    <p>
                      {somHabilitado
                        ? 'Você ouvirá cliques mecânicos de botão e sinos de experiência (XP) ao interagir.'
                        : 'Todos os sons do site estão temporariamente silenciados.'}
                    </p>
                  </div>

                  <div className="audio-botoes-row">
                    <button
                      type="button"
                      className={`btn-toggle-audio ${somHabilitado ? 'ativo' : 'mudo'}`}
                      onClick={() => alternarSom()}
                    >
                      {somHabilitado ? <Volume2 size={18} /> : <VolumeX size={18} />}
                      <span>{somHabilitado ? 'Som Ligado' : 'Mudo'}</span>
                    </button>

                    {somHabilitado && (
                      <button
                        type="button"
                        className="btn-testar-som"
                        onClick={() => {
                          tocarXP();
                        }}
                        title="Tocar som de teste"
                      >
                        <Sparkles size={14} />
                        <span>Testar Som de XP</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Seção 3: Sessão & Segurança */}
              <div className="config-card zona-logout">
                <div className="config-card-header">
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <LogOut size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h3>Encerrar Sessão</h3>
                    <small>Desconectar sua conta deste navegador com segurança</small>
                  </div>
                </div>

                <div className="logout-area">
                  <p>
                    Ao desconectar, você precisará digitar seu Nick ou E-mail novamente para acessar seu painel de pedidos e vantagens.
                  </p>
                  <button
                    type="button"
                    className="btn-logout-conta"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Sair da Minha Conta</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
