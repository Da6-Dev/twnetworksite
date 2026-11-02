import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const CONTAS_PADRAO = [
  {
    nick: 'TeDabliukkkkk',
    email: 'tedabliu@twnetwork.com.br',
    senha: '123',
    cargo: 'Fundador & Desenvolvedor',
    patenteVip: 'VIP Deus Supremo',
    dataRegistro: '15/01/2026',
    saldoCash: '150.000 Cash'
  },
  {
    nick: 'Minerador_Pro',
    email: 'minerador@twnetwork.com.br',
    senha: '123',
    cargo: 'Membro Veterano',
    patenteVip: 'VIP Titã III',
    dataRegistro: '02/02/2026',
    saldoCash: '45.000 Cash'
  }
];

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState(() => {
    try {
      const salvo = localStorage.getItem('tw_usuarios_cadastrados');
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch {
      // Ignora erro de JSON
    }
    return CONTAS_PADRAO;
  });

  const [usuario, setUsuario] = useState(() => {
    try {
      const salvo = localStorage.getItem('tw_usuario_logado');
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch {
      // Ignora erro
    }
    return null;
  });

  useEffect(() => {
    try {
      localStorage.setItem('tw_usuarios_cadastrados', JSON.stringify(usuarios));
    } catch {
      // Ignora erro
    }
  }, [usuarios]);

  useEffect(() => {
    try {
      if (usuario) {
        localStorage.setItem('tw_usuario_logado', JSON.stringify(usuario));
      } else {
        localStorage.removeItem('tw_usuario_logado');
      }
    } catch {
      // Ignora erro
    }
  }, [usuario]);

  // Persistência de Progresso do Jogador (Streak Diário & Passe de Batalha)
  const getStorageKeyProgresso = (nick) => `tw_progresso_${nick.toLowerCase()}`;

  const obterProgressoJogador = (nickAlvo) => {
    if (!nickAlvo) return null;
    try {
      const salvo = localStorage.getItem(getStorageKeyProgresso(nickAlvo));
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch {
      // Ignora erro
    }

    // Progresso inicial padrão
    const isVipPadrao = usuario?.patenteVip && usuario.patenteVip !== 'Nenhum';
    return {
      streak: {
        diaAtual: 1, // Dia pronto para resgatar
        diasColetados: [1], // Dia 1 coletado por cortesia ou vazio
        ultimoResgate: null,
        codigosResgate: {}
      },
      passe: {
        nivel: isVipPadrao ? 4 : 2,
        xp: 350,
        xpMaxNivel: 500,
        temVipPasse: isVipPadrao,
        recompensasFreeColetadas: [1],
        recompensasVipColetadas: isVipPadrao ? [1] : [],
        missoesConcluidas: ['m4']
      }
    };
  };

  const [progresso, setProgresso] = useState(() => {
    if (usuario) {
      return obterProgressoJogador(usuario.nick);
    }
    return null;
  });

  // Função de Login
  const login = (nickOuEmail, senha) => {
    const busca = nickOuEmail.trim().toLowerCase();
    const conta = usuarios.find(
      (u) =>
        (u.nick.toLowerCase() === busca || u.email.toLowerCase() === busca) &&
        u.senha === senha
    );

    if (conta) {
      setUsuario(conta);
      setProgresso(obterProgressoJogador(conta.nick));
      return { sucesso: true, usuario: conta };
    }
    return { sucesso: false, mensagem: 'Nick/E-mail ou senha incorretos!' };
  };

  // Função de Cadastro
  const cadastrar = ({ nick, email, senha }) => {
    const nickLimpo = nick.trim();
    const emailLimpo = email.trim().toLowerCase();

    // Valida se já existe
    const jaExiste = usuarios.some(
      (u) =>
        u.nick.toLowerCase() === nickLimpo.toLowerCase() ||
        u.email.toLowerCase() === emailLimpo
    );

    if (jaExiste) {
      return { sucesso: false, mensagem: 'Este Nick ou E-mail já está cadastrado!' };
    }

    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR');

    const novoUsuario = {
      nick: nickLimpo,
      email: emailLimpo,
      senha,
      cargo: 'Membro',
      patenteVip: 'Nenhum',
      dataRegistro: dataFormatada,
      saldoCash: '0 Cash'
    };

    setUsuarios((prev) => [...prev, novoUsuario]);
    setUsuario(novoUsuario);
    setProgresso(obterProgressoJogador(novoUsuario.nick));
    return { sucesso: true, usuario: novoUsuario };
  };

  // Login Rápido com Google
  const loginComGoogle = async (googleData = {}) => {
    const email = googleData.email || 'davipassos213@gmail.com';
    const nome = googleData.nome || 'Davi';
    const nickEscolhido = googleData.nick || (googleData.nome ? googleData.nome.replace(/[^a-zA-Z0-9_]/g, '') : 'Davi_Player');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nome, nickEscolhido, avatarGoogle: googleData.avatar })
      });
      if (res.ok) {
        const dados = await res.json();
        if (dados.sucesso && dados.usuario) {
          setUsuario(dados.usuario);
          setProgresso(obterProgressoJogador(dados.usuario.nick));
          setUsuarios((prev) => {
            if (!prev.some((u) => u.email.toLowerCase() === dados.usuario.email.toLowerCase())) {
              return [...prev, dados.usuario];
            }
            return prev;
          });
          return { sucesso: true, usuario: dados.usuario, novo: dados.novo };
        }
      }
    } catch {
      // Fallback local caso fetch falhe
    }

    // Fallback local imediato
    const emailLimpo = email.toLowerCase();
    const contaExistente = usuarios.find((u) => u.email.toLowerCase() === emailLimpo);
    if (contaExistente) {
      setUsuario(contaExistente);
      setProgresso(obterProgressoJogador(contaExistente.nick));
      return { sucesso: true, usuario: contaExistente, novo: false };
    }

    const agora = new Date().toLocaleDateString('pt-BR');
    const novoUsuario = {
      id: `user_google_${Date.now()}`,
      nick: nickEscolhido,
      email: emailLimpo,
      tipoConta: 'pirata', // Todos como pirata conforme solicitado
      cargo: 'Membro',
      patenteVip: 'Nenhum',
      dataRegistro: agora,
      saldoCash: '0 Cash',
      metodoAuth: 'google'
    };

    setUsuarios((prev) => [...prev, novoUsuario]);
    setUsuario(novoUsuario);
    setProgresso(obterProgressoJogador(novoUsuario.nick));
    return { sucesso: true, usuario: novoUsuario, novo: true };
  };

  // Validação de Conta de Minecraft (Modo Pirata/Offline por Padrão)
  const validarNickMinecraft = useCallback(async (nick) => {
    if (!nick || nick.trim().length < 3) {
      return { valido: false, erro: 'O Nick deve ter pelo menos 3 caracteres.' };
    }
    const limpo = nick.trim();
    if (limpo.length > 16) {
      return { valido: false, erro: 'O Nick pode ter no máximo 16 caracteres.' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(limpo)) {
      return { valido: false, erro: 'O Nick só pode conter letras, números e underscore (_).' };
    }

    try {
      const res = await fetch(`/api/auth/validar-nick/${limpo}`);
      if (res.ok) {
        const dados = await res.json();
        return { valido: true, ...dados };
      }
    } catch {
      // Fallback
    }

    // Como solicitado: "se for jogador pirata deixa ele só colocar o nickname, e ja deixa por enquanto todos como se fosse"
    return {
      sucesso: true,
      valido: true,
      nick: limpo,
      tipoConta: 'pirata',
      tipoContaRotulo: 'Jogador Pirata / Livre',
      mensagem: 'Nickname verificado no Modo Pirata/Offline!',
      avatarUrl: `https://mc-heads.net/avatar/${limpo}/80`,
      bodySkinUrl: `https://mc-heads.net/body/${limpo}/160`
    };
  }, []);

  // Login Rápido com Contas Demo
  const loginDemo = (nickDemo) => {
    const conta = usuarios.find(
      (u) => u.nick.toLowerCase() === nickDemo.toLowerCase()
    );
    if (conta) {
      setUsuario(conta);
      setProgresso(obterProgressoJogador(conta.nick));
      return true;
    }
    return false;
  };

  // Logout
  const logout = () => {
    setUsuario(null);
    setProgresso(null);
  };

  // Salva alterações no progresso
  const salvarProgresso = (novoProgresso) => {
    if (!usuario?.nick) return;
    setProgresso(novoProgresso);
    try {
      localStorage.setItem(
        getStorageKeyProgresso(usuario.nick),
        JSON.stringify(novoProgresso)
      );
    } catch {
      // Ignora erro
    }
  };

  // Resgatar dia no calendário de 7 dias
  const resgatarDiaCalendario = (dia) => {
    if (!usuario || !progresso) return { sucesso: false, mensagem: 'Usuário não conectado' };

    const streak = progresso.streak || { diaAtual: 1, diasColetados: [], codigosResgate: {} };
    if (streak.diasColetados.includes(dia)) {
      return { sucesso: false, mensagem: 'Este dia já foi resgatado!' };
    }

    const codigo = `TW-7D-D${dia}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const novosDias = [...streak.diasColetados, dia];
    const proximoDia = dia < 7 ? dia + 1 : 1;

    const novoProgresso = {
      ...progresso,
      streak: {
        ...streak,
        diaAtual: proximoDia,
        diasColetados: novosDias,
        ultimoResgate: new Date().toISOString(),
        codigosResgate: {
          ...streak.codigosResgate,
          [dia]: codigo
        }
      }
    };

    salvarProgresso(novoProgresso);
    return { sucesso: true, codigo, comando: `/recompensa resgatar ${codigo}` };
  };

  // Completar missão no Passe de Batalha e somar XP
  const completarMissaoPasse = (missaoId, xpGanho) => {
    if (!usuario || !progresso) return;
    const passe = progresso.passe;
    if (passe.missoesConcluidas.includes(missaoId)) return;

    let novoXp = passe.xp + xpGanho;
    let novoNivel = passe.nivel;
    const xpPorNivel = passe.xpMaxNivel || 500;

    while (novoXp >= xpPorNivel && novoNivel < 10) {
      novoXp -= xpPorNivel;
      novoNivel += 1;
    }

    const novoProgresso = {
      ...progresso,
      passe: {
        ...passe,
        nivel: novoNivel,
        xp: novoNivel >= 10 ? xpPorNivel : novoXp,
        missoesConcluidas: [...passe.missoesConcluidas, missaoId]
      }
    };

    salvarProgresso(novoProgresso);
    return { subiuNivel: novoNivel > passe.nivel, novoNivel };
  };

  // Resgatar recompensa de nível do Passe (free ou vip)
  const resgatarRecompensaPasse = (nivel, tipo = 'free') => {
    if (!usuario || !progresso) return { sucesso: false };
    const passe = progresso.passe;

    if (tipo === 'free') {
      if (passe.recompensasFreeColetadas.includes(nivel)) return { sucesso: false };
      const novoProgresso = {
        ...progresso,
        passe: {
          ...passe,
          recompensasFreeColetadas: [...passe.recompensasFreeColetadas, nivel]
        }
      };
      salvarProgresso(novoProgresso);
      const codigo = `TW-PASSE-LVL${nivel}-F-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      return { sucesso: true, codigo, comando: `/passe resgatar ${codigo}` };
    } else {
      if (!passe.temVipPasse) return { sucesso: false, precisaVip: true };
      if (passe.recompensasVipColetadas.includes(nivel)) return { sucesso: false };
      const novoProgresso = {
        ...progresso,
        passe: {
          ...passe,
          recompensasVipColetadas: [...passe.recompensasVipColetadas, nivel]
        }
      };
      salvarProgresso(novoProgresso);
      const codigo = `TW-PASSE-LVL${nivel}-VIP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      return { sucesso: true, codigo, comando: `/passe resgatar ${codigo}` };
    }
  };

  // Ativar Passe VIP manualmente / instantaneamente
  const ativarPasseVip = () => {
    if (!usuario || !progresso) return;
    const novoProgresso = {
      ...progresso,
      passe: {
        ...progresso.passe,
        temVipPasse: true
      }
    };
    salvarProgresso(novoProgresso);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        estaLogado: !!usuario,
        login,
        cadastrar,
        loginDemo,
        logout,
        loginComGoogle,
        validarNickMinecraft,
        progresso,
        resgatarDiaCalendario,
        completarMissaoPasse,
        resgatarRecompensaPasse,
        ativarPasseVip
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
