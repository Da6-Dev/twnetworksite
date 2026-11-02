import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Banco de dados em memória inicial (com contas padrão)
interface Usuario {
  id: string;
  nick: string;
  email: string;
  senha?: string;
  tipoConta: 'pirata' | 'original';
  cargo: string;
  patenteVip: string;
  dataRegistro: string;
  saldoCash: string;
  metodoAuth: 'senha' | 'google';
  avatarUrl?: string;
}

const usuariosDB: Usuario[] = [
  {
    id: 'user_1',
    nick: 'TeDabliukkkkk',
    email: 'tedabliu@twnetwork.com.br',
    senha: '123',
    tipoConta: 'pirata', // Jogador pirata por padrão
    cargo: 'Fundador & Desenvolvedor',
    patenteVip: 'VIP Deus Supremo',
    dataRegistro: '15/01/2026',
    saldoCash: '150.000 Cash',
    metodoAuth: 'senha'
  },
  {
    id: 'user_2',
    nick: 'Minerador_Pro',
    email: 'minerador@twnetwork.com.br',
    senha: '123',
    tipoConta: 'pirata',
    cargo: 'Membro Veterano',
    patenteVip: 'VIP Titã III',
    dataRegistro: '02/02/2026',
    saldoCash: '45.000 Cash',
    metodoAuth: 'senha'
  }
];

// Helper: validação de formato de Nick do Minecraft
function validarFormatoNick(nick: string) {
  if (!nick) return { valido: false, erro: 'Informe o Nickname do Minecraft.' };
  const limpo = nick.trim();
  if (limpo.length < 3 || limpo.length > 16) {
    return { valido: false, erro: 'O Nick deve ter entre 3 e 16 caracteres.' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(limpo)) {
    return { valido: false, erro: 'O Nick só pode conter letras, números e underscore (_).' };
  }
  return { valido: true, nick: limpo };
}

/* ==========================================================================
   ROTAS DE API DE AUTENTICAÇÃO
   ========================================================================== */

// 1. Validação de Conta de Minecraft (Modo Pirata/Offline por Padrão)
app.get('/api/auth/validar-nick/:nick', (req, res) => {
  const { nick } = req.params;
  const validacao = validarFormatoNick(nick);
  if (!validacao.valido) {
    return res.status(400).json({ sucesso: false, mensagem: validacao.erro });
  }

  // Deixa todos como pirata por padrão conforme solicitação
  return res.json({
    sucesso: true,
    nick: validacao.nick,
    tipoConta: 'pirata',
    tipoContaRotulo: 'Jogador Pirata / Livre',
    mensagem: 'Nickname verificado e aprovado no Modo Pirata/Offline!',
    avatarUrl: `https://mc-heads.net/avatar/${validacao.nick}/80`,
    bodySkinUrl: `https://mc-heads.net/body/${validacao.nick}/160`
  });
});

// 2. Login com E-mail ou Nick
app.post('/api/auth/login', (req, res) => {
  const { identificador, senha } = req.body;
  if (!identificador || !senha) {
    return res.status(400).json({ sucesso: false, mensagem: 'Preencha o Nick/E-mail e a senha.' });
  }

  const busca = identificador.trim().toLowerCase();
  const conta = usuariosDB.find(
    (u) => (u.nick.toLowerCase() === busca || u.email.toLowerCase() === busca) && u.senha === senha
  );

  if (!conta) {
    return res.status(401).json({ sucesso: false, mensagem: 'Nick/E-mail ou senha incorretos!' });
  }

  const { senha: _, ...usuarioPublico } = conta;
  return res.json({ sucesso: true, usuario: usuarioPublico });
});

// 3. Login Rápido com Google
app.post('/api/auth/google', (req, res) => {
  const { email, nome, nickEscolhido, avatarGoogle } = req.body;
  if (!email) {
    return res.status(400).json({ sucesso: false, mensagem: 'E-mail do Google não informado.' });
  }

  const emailLimpo = email.trim().toLowerCase();
  const contaExistente = usuariosDB.find((u) => u.email.toLowerCase() === emailLimpo);

  if (contaExistente) {
    const { senha: _, ...usuarioPublico } = contaExistente;
    return res.json({ sucesso: true, usuario: usuarioPublico, novo: false });
  }

  // Se for nova conta, define o nick do Minecraft (modo pirata padrão)
  const nickFinal = (nickEscolhido || nome || email.split('@')[0])
    .replace(/[^a-zA-Z0-9_]/g, '')
    .substring(0, 16) || 'Jogador';

  const agora = new Date().toLocaleDateString('pt-BR');
  const novoUsuario: Usuario = {
    id: `user_google_${Date.now()}`,
    nick: nickFinal,
    email: emailLimpo,
    tipoConta: 'pirata', // Todos como pirata por enquanto
    cargo: 'Membro',
    patenteVip: 'Nenhum',
    dataRegistro: agora,
    saldoCash: '0 Cash',
    metodoAuth: 'google',
    avatarUrl: avatarGoogle || `https://mc-heads.net/avatar/${nickFinal}/80`
  };

  usuariosDB.push(novoUsuario);
  const { senha: _, ...usuarioPublico } = novoUsuario;
  return res.json({ sucesso: true, usuario: usuarioPublico, novo: true });
});

// 4. Cadastro Tradicional (Nick Minecraft + E-mail + Senha)
app.post('/api/auth/cadastrar', (req, res) => {
  const { nick, email, senha } = req.body;

  const validacao = validarFormatoNick(nick);
  if (!validacao.valido) {
    return res.status(400).json({ sucesso: false, mensagem: validacao.erro });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ sucesso: false, mensagem: 'Informe um e-mail válido.' });
  }

  if (!senha || senha.length < 3) {
    return res.status(400).json({ sucesso: false, mensagem: 'A senha deve ter pelo menos 3 caracteres.' });
  }

  const emailLimpo = email.trim().toLowerCase();
  const jaExiste = usuariosDB.some(
    (u) => u.nick.toLowerCase() === validacao.nick!.toLowerCase() || u.email.toLowerCase() === emailLimpo
  );

  if (jaExiste) {
    return res.status(400).json({ sucesso: false, mensagem: 'Este Nick ou E-mail já está cadastrado!' });
  }

  const agora = new Date().toLocaleDateString('pt-BR');
  const novoUsuario: Usuario = {
    id: `user_${Date.now()}`,
    nick: validacao.nick!,
    email: emailLimpo,
    senha,
    tipoConta: 'pirata', // Sempre pirata/livre por padrão
    cargo: 'Membro',
    patenteVip: 'Nenhum',
    dataRegistro: agora,
    saldoCash: '0 Cash',
    metodoAuth: 'senha'
  };

  usuariosDB.push(novoUsuario);
  const { senha: _, ...usuarioPublico } = novoUsuario;
  return res.json({ sucesso: true, usuario: usuarioPublico });
});

// 5. Status do Sistema / Health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', rede: 'TW Network', modo: 'full-stack' });
});

/* ==========================================================================
   INICIALIZAÇÃO DO SERVIDOR COM VITE MIDDLEWARE
   ========================================================================== */
async function iniciarServidor() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Full-Stack TW Network online em http://0.0.0.0:${PORT}`);
  });
}

iniciarServidor();
