import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { MercadoPagoConfig, Payment, Preference, CardToken } from 'mercadopago';
import { query } from './db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);

const PORT = Number(process.env.PORT) || 3000;
const DEV_JWT_SECRET = 'twnetwork_jwt_secret_dev_2026_rankup_natal';
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret || secret === DEV_JWT_SECRET || secret === 'undefined' || secret === 'null') {
    throw new Error(
      'Configuração inválida para produção: JWT_SECRET não foi definido ou está utilizando a chave padrão insegura de desenvolvimento.'
    );
  }
}

const JWT_SECRET = process.env.JWT_SECRET?.trim() || DEV_JWT_SECRET;

const googleOAuthClient = new OAuth2Client();

// Cliente dinâmico do Mercado Pago (recarrega .env a cada requisição)
function getMpClient() {
  dotenv.config();
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim() || '';
  if (!token) return null;
  return new MercadoPagoConfig({ accessToken: token });
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "blob:", "https://mc-heads.net", "https://*.googleusercontent.com"],
        connectSrc: ["'self'", "https://accounts.google.com", "https://api.mercadopago.com", "ws:", "wss:"],
        frameSrc: ["'self'", "https://accounts.google.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

const defaultAllowedOrigins = ['https://twnetwork.com.br', 'https://www.twnetwork.com.br'];
const parsedAllowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, '')).filter(Boolean)
  : [];
const allowedOrigins = parsedAllowedOrigins.length > 0 ? parsedAllowedOrigins : defaultAllowedOrigins;

app.use(
  cors({
    origin: isProduction ? allowedOrigins : true,
    credentials: true,
  })
);
app.use(express.json());

// Rate Limiter Global para a API (proteção contra DoS e abuso)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.replace(/\/+$/, '') === '/health' || req.originalUrl.split('?')[0].replace(/\/+$/, '') === '/api/health',
  message: { sucesso: false, mensagem: 'Muitas requisições deste IP. Tente novamente mais tarde.' }
});

// Rate Limiter Anti-Brute-Force para Autenticação (Login e Cadastro)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo de 20 tentativas por 15 minutos
  standardHeaders: true,
  legacyHeaders: false,
  message: { sucesso: false, mensagem: 'Muitas tentativas de autenticação. Aguarde alguns minutos.' }
});

// Rate Limiter para Cupons (evita enumeração/adivinhação de cupons)
const cupomLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { sucesso: false, mensagem: 'Muitas tentativas de validação de cupom.' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/cadastrar', authLimiter);
app.use('/api/cupons/validar', cupomLimiter);

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

// Criação e Seed inicial de contas no PostgreSQL (se a tabela estiver vazia)
async function inicializarBanco() {
  try {
    await query(`
      ALTER TABLE usuarios 
      ADD COLUMN IF NOT EXISTS nick_vinculado BOOLEAN DEFAULT false;
    `);
    await query(`
      UPDATE usuarios 
      SET nick_vinculado = true 
      WHERE nick IN ('TeDabliukkkkk', 'Minerador_Pro') AND nick_vinculado IS NOT TRUE;
    `);
    const check = await query('SELECT COUNT(*) FROM usuarios');
    if (parseInt(check.rows[0].count) === 0) {
      const senhaPadraoHash = await bcrypt.hash('123', 10);
      await query(`
        INSERT INTO usuarios (nick, email, senha_hash, tipo_conta, cargo, patente_vip, saldo_cash, nick_vinculado)
        VALUES 
          ('TeDabliukkkkk', 'tedabliu@twnetwork.com.br', $1, 'pirata', 'Fundador & Desenvolvedor', 'VIP Deus Supremo', 150000, true),
          ('Minerador_Pro', 'minerador@twnetwork.com.br', $1, 'pirata', 'Membro Veterano', 'VIP Titã III', 45000, true)
      `, [senhaPadraoHash]);
      console.log('✅ Banco PostgreSQL semeado com as contas padrão da Staff!');
    }

    const checkCupons = await query('SELECT COUNT(*) FROM cupons');
    if (parseInt(checkCupons.rows[0].count) === 0) {
      await query(`
        INSERT INTO cupons (codigo, desconto_percentual, ativo)
        VALUES 
          ('TWSTUDIOS', 15, true),
          ('BEMVINDO', 10, true),
          ('TEDABLIU', 20, true),
          ('NATAL20', 20, true),
          ('TWNETWORK', 10, true)
      `);
      console.log('✅ Cupons promocionais semeados no PostgreSQL!');
    }
  } catch (err) {
    console.error('⚠️ Aviso ao verificar/semear banco:', err);
  }
}

/* ==========================================================================
   ROTAS DE API DE AUTENTICAÇÃO REAL (POSTGRESQL + BCRYPT + JWT)
   ========================================================================== */

// 1. Validação de Nick do Minecraft
app.get('/api/auth/validar-nick/:nick', async (req, res) => {
  const { nick } = req.params;
  const validacao = validarFormatoNick(nick);
  if (!validacao.valido) {
    return res.status(400).json({ sucesso: false, mensagem: validacao.erro });
  }

  // Verifica se o nick já está em uso por outro cadastro
  try {
    const existente = await query('SELECT id FROM usuarios WHERE LOWER(nick) = LOWER($1)', [validacao.nick]);
    const ocupado = existente.rows.length > 0;

    return res.json({
      sucesso: true,
      nick: validacao.nick,
      ocupado,
      tipoConta: 'pirata',
      tipoContaRotulo: 'Jogador Pirata / Livre',
      mensagem: ocupado ? 'Nick já possui cadastro no site.' : 'Nickname verificado e disponível!',
      avatarUrl: `https://mc-heads.net/avatar/${validacao.nick}/80`,
      bodySkinUrl: `https://mc-heads.net/body/${validacao.nick}/160`
    });
  } catch {
    return res.json({
      sucesso: true,
      nick: validacao.nick,
      tipoConta: 'pirata',
      tipoContaRotulo: 'Jogador Pirata / Livre',
      avatarUrl: `https://mc-heads.net/avatar/${validacao.nick}/80`,
      bodySkinUrl: `https://mc-heads.net/body/${validacao.nick}/160`
    });
  }
});

// 2. Cadastro Real (PostgreSQL + Bcrypt + JWT)
app.post('/api/auth/cadastrar', async (req, res) => {
  try {
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
    const nickLimpo = validacao.nick!;

    // Verifica se já existe por Nick ou E-mail
    const jaExiste = await query(
      'SELECT id, nick, email FROM usuarios WHERE LOWER(nick) = LOWER($1) OR LOWER(email) = LOWER($2)',
      [nickLimpo, emailLimpo]
    );

    if (jaExiste.rows.length > 0) {
      const match = jaExiste.rows[0];
      if (match.nick.toLowerCase() === nickLimpo.toLowerCase()) {
        return res.status(400).json({ sucesso: false, mensagem: 'Este Nick do Minecraft já está cadastrado!' });
      }
      return res.status(400).json({ sucesso: false, mensagem: 'Este endereço de e-mail já está em uso!' });
    }

    // Criptografa a senha com hash seguro (salt rounds = 10)
    const senhaHash = await bcrypt.hash(senha, 10);

    // Insere no banco PostgreSQL
    const novo = await query(`
      INSERT INTO usuarios (nick, email, senha_hash, tipo_conta, cargo, patente_vip, saldo_cash)
      VALUES ($1, $2, $3, 'pirata', 'Membro', 'Nenhum', 0)
      RETURNING id, nick, email, tipo_conta, cargo, patente_vip, saldo_cash, criado_em
    `, [nickLimpo, emailLimpo, senhaHash]);

    const user = novo.rows[0];
    const usuarioFormatado = {
      id: `user_${user.id}`,
      nick: user.nick,
      email: user.email,
      cargo: user.cargo,
      patenteVip: user.patente_vip,
      saldoCash: `${user.saldo_cash.toLocaleString('pt-BR')} Cash`,
      dataRegistro: new Date(user.criado_em).toLocaleDateString('pt-BR'),
      tipoConta: user.tipo_conta,
      avatarUrl: `https://mc-heads.net/avatar/${user.nick}/80`,
      nickVinculado: user.nick_vinculado === true
    };

    // Gera o token JWT para a sessão do jogador
    const token = jwt.sign(
      { id: user.id, nick: user.nick, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      sucesso: true,
      token,
      usuario: usuarioFormatado
    });
  } catch (error: any) {
    console.error('Erro no cadastro:', error);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao realizar cadastro.' });
  }
});

// 3. Login Real (PostgreSQL + Bcrypt + JWT)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identificador, senha } = req.body;
    if (!identificador || !senha) {
      return res.status(400).json({ sucesso: false, mensagem: 'Preencha o Nick/E-mail e a senha.' });
    }

    const busca = identificador.trim().toLowerCase();
    const resultado = await query(
      'SELECT * FROM usuarios WHERE LOWER(nick) = LOWER($1) OR LOWER(email) = LOWER($1)',
      [busca]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ sucesso: false, mensagem: 'Nick/E-mail ou senha incorretos!' });
    }

    const user = resultado.rows[0];

    // Valida a senha comparando o hash do banco
    const senhaCorreta = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ sucesso: false, mensagem: 'Nick/E-mail ou senha incorretos!' });
    }

    const usuarioFormatado = {
      id: `user_${user.id}`,
      nick: user.nick,
      email: user.email,
      cargo: user.cargo,
      patenteVip: user.patente_vip,
      saldoCash: `${user.saldo_cash.toLocaleString('pt-BR')} Cash`,
      dataRegistro: new Date(user.criado_em).toLocaleDateString('pt-BR'),
      tipoConta: user.tipo_conta,
      avatarUrl: `https://mc-heads.net/avatar/${user.nick}/80`,
      nickVinculado: user.nick_vinculado === true
    };

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, nick: user.nick, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      sucesso: true,
      token,
      usuario: usuarioFormatado
    });
  } catch (error: any) {
    console.error('Erro no login:', error);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao realizar login.' });
  }
});

// 4. Configuração do Google Client ID
app.get('/api/auth/google/client-id', (_req, res) => {
  dotenv.config();
  res.json({ clientId: process.env.GOOGLE_CLIENT_ID || '' });
});

// 4.1 Login / Cadastro Oficial com Google Identity Services (GSI)
app.post('/api/auth/google', async (req, res) => {
  try {
    let email = req.body.email;
    let nome = req.body.nome;
    let avatarGoogle = req.body.avatarGoogle;
    let nickEscolhido = req.body.nickEscolhido;

    // Se vier o token criptográfico 'credential' emitido pelo Google
    if (req.body.credential) {
      dotenv.config();
      const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || '';
      try {
        const ticket = await googleOAuthClient.verifyIdToken({
          idToken: req.body.credential,
          audience: clientId || undefined
        });
        const payload = ticket.getPayload();
        if (payload?.email) {
          email = payload.email;
          nome = payload.name;
          avatarGoogle = payload.picture;
        } else {
          return res.status(401).json({ sucesso: false, mensagem: 'Token do Google não contém e-mail válido.' });
        }
      } catch (verifErr: any) {
        console.error('⚠️ [SEGURANÇA A08] Assinatura do Token Google rejeitada:', verifErr.message);
        return res.status(401).json({ 
          sucesso: false, 
          mensagem: 'Falha na validação de segurança: o token do Google não pôde ser autenticado.' 
        });
      }
    }

    if (!email) {
      return res.status(400).json({ sucesso: false, mensagem: 'E-mail do Google não informado.' });
    }

    const emailLimpo = email.trim().toLowerCase();
    const busca = await query('SELECT * FROM usuarios WHERE LOWER(email) = LOWER($1)', [emailLimpo]);

    if (busca.rows.length > 0) {
      const user = busca.rows[0];
      const usuarioFormatado = {
        id: `user_${user.id}`,
        nick: user.nick,
        email: user.email,
        cargo: user.cargo,
        patenteVip: user.patente_vip,
        saldoCash: `${user.saldo_cash.toLocaleString('pt-BR')} Cash`,
        dataRegistro: new Date(user.criado_em).toLocaleDateString('pt-BR'),
        tipoConta: user.tipo_conta,
        avatarUrl: avatarGoogle || user.avatar_url || `https://mc-heads.net/avatar/${user.nick}/80`
      };

      const token = jwt.sign(
        { id: user.id, nick: user.nick, email: user.email },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.json({ sucesso: true, token, usuario: usuarioFormatado, novo: false });
    }

    // Se for novo jogador via Google, cria no PostgreSQL
    let nickFinal = (nickEscolhido || '').trim();
    let vinculado = false;
    if (nickFinal) {
      const v = validarFormatoNick(nickFinal);
      if (v.valido) {
        nickFinal = v.nick!;
        vinculado = true;
      }
    }

    if (!vinculado) {
      const baseNick = (nome || email.split('@')[0])
        .replace(/[^a-zA-Z0-9_]/g, '')
        .substring(0, 10) || 'Jogador';
      const randNum = Math.floor(1000 + Math.random() * 9000);
      nickFinal = `${baseNick}_${randNum}`.substring(0, 16);
      vinculado = false;
    }

    const senhaAleatoriaHash = await bcrypt.hash(Math.random().toString(36), 10);
    const novo = await query(`
      INSERT INTO usuarios (nick, email, senha_hash, tipo_conta, cargo, patente_vip, saldo_cash, nick_vinculado)
      VALUES ($1, $2, $3, 'pirata', 'Membro', 'Nenhum', 0, $4)
      RETURNING *
    `, [nickFinal, emailLimpo, senhaAleatoriaHash, vinculado]);

    const user = novo.rows[0];
    const usuarioFormatado = {
      id: `user_${user.id}`,
      nick: user.nick,
      email: user.email,
      cargo: user.cargo,
      patenteVip: user.patente_vip,
      saldoCash: `${user.saldo_cash.toLocaleString('pt-BR')} Cash`,
      dataRegistro: new Date(user.criado_em).toLocaleDateString('pt-BR'),
      tipoConta: user.tipo_conta,
      avatarUrl: `https://mc-heads.net/avatar/${user.nick}/80`,
      nickVinculado: vinculado
    };

    const token = jwt.sign(
      { id: user.id, nick: user.nick, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({ sucesso: true, token, usuario: usuarioFormatado, novo: true });
  } catch (error: any) {
    console.error('Erro no login com Google:', error);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao autenticar com o Google.' });
  }
});

// 5.1 Vincular / Atualizar Nick do Minecraft (para jogadores Google ou alteração)
app.put('/api/auth/vincular-nick', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number };
    const { novoNick } = req.body;

    const validacao = validarFormatoNick(novoNick);
    if (!validacao.valido) {
      return res.status(400).json({ sucesso: false, mensagem: validacao.erro });
    }

    const nickFormatado = validacao.nick!;

    // Verifica se outro usuário já está usando este nick
    const jaExiste = await query(
      'SELECT id FROM usuarios WHERE LOWER(nick) = LOWER($1) AND id != $2',
      [nickFormatado, payload.id]
    );

    if (jaExiste.rows.length > 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: `O Nick '${nickFormatado}' já está em uso por outro jogador!`
      });
    }

    // Atualiza o nickname do jogador e marca como vinculado
    const atualizado = await query(`
      UPDATE usuarios 
      SET nick = $1, nick_vinculado = true 
      WHERE id = $2 
      RETURNING *
    `, [nickFormatado, payload.id]);

    if (atualizado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Jogador não encontrado.' });
    }

    const user = atualizado.rows[0];
    const usuarioFormatado = {
      id: `user_${user.id}`,
      nick: user.nick,
      email: user.email,
      cargo: user.cargo,
      patenteVip: user.patente_vip,
      saldoCash: `${user.saldo_cash.toLocaleString('pt-BR')} Cash`,
      dataRegistro: new Date(user.criado_em).toLocaleDateString('pt-BR'),
      tipoConta: user.tipo_conta,
      avatarUrl: `https://mc-heads.net/avatar/${user.nick}/80`,
      nickVinculado: true
    };

    const novoToken = jwt.sign(
      { id: user.id, nick: user.nick, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      sucesso: true,
      mensagem: `Nick do Minecraft vinculado com sucesso: ${user.nick}!`,
      token: novoToken,
      usuario: usuarioFormatado
    });
  } catch (error: any) {
    console.error('Erro ao vincular nick:', error);
    return res.status(401).json({ sucesso: false, mensagem: 'Sessão inválida ou expirada. Faça login novamente.' });
  }
});

// 5. Obter perfil do usuário logado via Token JWT
app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number };
    const resultado = await query('SELECT * FROM usuarios WHERE id = $1', [payload.id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado.' });
    }

    const user = resultado.rows[0];
    return res.json({
      sucesso: true,
      usuario: {
        id: `user_${user.id}`,
        nick: user.nick,
        email: user.email,
        cargo: user.cargo,
        patenteVip: user.patente_vip,
        saldoCash: `${user.saldo_cash.toLocaleString('pt-BR')} Cash`,
        dataRegistro: new Date(user.criado_em).toLocaleDateString('pt-BR'),
        tipoConta: user.tipo_conta,
        avatarUrl: `https://mc-heads.net/avatar/${user.nick}/80`
      }
    });
  } catch {
    return res.status(401).json({ sucesso: false, mensagem: 'Sessão expirada. Faça login novamente.' });
  }
});

// Helper para sanitizar preços do carrinho (ex: "R$ 49,90" -> 49.90)
// Helper para extrair ID do usuário pelo Token JWT se fornecido
function extrairUsuarioId(req: express.Request): number | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
      return payload.id || null;
    } catch {}
  }
  return null;
}

function extrairPreco(valor: any): number {
  if (typeof valor === 'number' && !isNaN(valor)) return valor;
  if (!valor) return 0;
  const str = String(valor).replace(/[^\d.,]/g, '').replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

/* ==========================================================================
   ROTAS DE CHECKOUT E MERCADO PAGO (PAGAMENTO REAL VIA PIX)
   ========================================================================== */


/* ==========================================================================
   FUNÇÃO DE ENTREGA AUTOMÁTICA DE VIPS E CASH NO POSTGRESQL
   ========================================================================== */
async function entregarPedidoNoSite(pedidoId: number) {
  try {
    const resPedido = await query('SELECT * FROM pedidos WHERE id = $1', [pedidoId]);
    if (resPedido.rows.length === 0) {
      return { sucesso: false, mensagem: 'Pedido não encontrado.' };
    }

    const pedido = resPedido.rows[0];

    // Evita duplicidade de entrega (idempotência)
    if (pedido.status === 'ENTREGUE') {
      return { sucesso: true, jaEntregue: true };
    }

    const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
    let cashParaAdicionar = 0;
    let novoVip: string | null = null;

    for (const item of itens) {
      const nome = String(item.nome || '');
      const qtd = Number(item.quantidade) || 1;

      // 1. Identificação de Pacotes de Cash
      if (nome.toLowerCase().includes('cash')) {
        let cashItem = 0;
        if (item.id === 101) {
          cashItem = 5000;
        } else if (item.id === 102) {
          cashItem = 17000;
        } else if (item.id === 103) {
          cashItem = 50000;
        } else {
          // Extração inteligente de números (ex: "100.000 Cash" -> 100000)
          const nums = nome.match(/(\d+[.\d]*)/g);
          if (nums) {
            for (const n of nums) {
              const val = parseInt(n.replace(/\./g, ''), 10);
              if (val >= 100) cashItem += val;
            }
          }
        }
        cashParaAdicionar += cashItem * qtd;
      }

      // 2. Identificação de Planos VIP
      if (nome.toLowerCase().includes('vip')) {
        novoVip = item.nome.trim();
      }
    }

    // Localiza o usuário correspondente no PostgreSQL
    let userResult = null;
    if (pedido.usuario_id) {
      userResult = await query('SELECT id, nick, email, saldo_cash, patente_vip FROM usuarios WHERE id = $1', [pedido.usuario_id]);
    }
    if (!userResult || userResult.rows.length === 0) {
      userResult = await query('SELECT id, nick, email, saldo_cash, patente_vip FROM usuarios WHERE LOWER(nick) = LOWER($1)', [pedido.nick]);
    }
    if (!userResult || userResult.rows.length === 0) {
      userResult = await query('SELECT id, nick, email, saldo_cash, patente_vip FROM usuarios WHERE LOWER(email) = LOWER($1)', [pedido.email]);
    }

    if (userResult && userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const updates: string[] = [];
      const params: any[] = [];
      let pIdx = 1;

      if (cashParaAdicionar > 0) {
        updates.push(`saldo_cash = saldo_cash + ${pIdx}`);
        params.push(cashParaAdicionar);
        pIdx++;
      }

      if (novoVip) {
        updates.push(`patente_vip = ${pIdx}`);
        params.push(novoVip);
        pIdx++;
      }

      if (updates.length > 0) {
        params.push(user.id);
        await query(`
          UPDATE usuarios 
          SET ${updates.join(', ')} 
          WHERE id = ${pIdx}
        `, params);

        console.log(`📦 [ENTREGA AUTOMÁTICA] Pedido #${pedidoId} -> Jogador ${user.nick}: +${cashParaAdicionar} Cash | VIP: ${novoVip || 'Inalterado'}`);
      }
    }

    // Atualiza o pedido para 'ENTREGUE'
    await query(`
      UPDATE pedidos 
      SET status = 'ENTREGUE', pago_em = COALESCE(pago_em, CURRENT_TIMESTAMP) 
      WHERE id = $1
    `, [pedidoId]);

    return { 
      sucesso: true, 
      pedidoId, 
      cashEntregue: cashParaAdicionar, 
      vipEntregue: novoVip, 
      nick: pedido.nick 
    };
  } catch (err) {
    console.error('Erro na entrega automática do pedido:', err);
    return { sucesso: false, erro: err };
  }
}

// 6. Criar Pagamento Pix Real com Mercado Pago
app.post('/api/checkout/pix', async (req, res) => {
  try {
    const { nick, email, discord, itens, valorTotal } = req.body;

    if (!nick || !valorTotal || !itens || itens.length === 0) {
      return res.status(400).json({ sucesso: false, mensagem: 'Dados incompletos para gerar o pagamento.' });
    }

    const valorNumerico = Number(Number(valorTotal).toFixed(2));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      return res.status(400).json({ sucesso: false, mensagem: 'Valor inválido para o pedido.' });
    }

    const mp = getMpClient();
    const emailLimpo = (email && email.includes('@')) ? email.trim() : 'comprador@twnetwork.com.br';

    // Se as credenciais do Mercado Pago estiverem configuradas, gera cobrança real
    if (mp) {
      try {
        const payment = new Payment(mp);
        const mpResponse = await payment.create({
          body: {
            transaction_amount: valorNumerico,
            description: `TW Network RankUP - Jogador ${nick}`,
            payment_method_id: 'pix',
            payer: {
              email: emailLimpo,
              first_name: nick.trim()
            }
          }
        });

        const qrCode = mpResponse.point_of_interaction?.transaction_data?.qr_code || '';
        const qrCodeBase64 = mpResponse.point_of_interaction?.transaction_data?.qr_code_base64 || '';
        const ticketUrl = mpResponse.point_of_interaction?.transaction_data?.ticket_url || '';
        const paymentId = String(mpResponse.id);

        const usuarioId = extrairUsuarioId(req);
        // Salva o pedido no PostgreSQL
        const dbRes = await query(`
          INSERT INTO pedidos (usuario_id, nick, email, discord, metodo, status, valor_total, mp_payment_id, pix_copia_cola, pix_qr_code_base64, itens)
          VALUES ($1, $2, $3, $4, 'pix', 'PENDENTE', $5, $6, $7, $8, $9)
          RETURNING id, criado_em
        `, [usuarioId, nick.trim(), emailLimpo, discord || '', valorNumerico, paymentId, qrCode, qrCodeBase64, JSON.stringify(itens)]);

        const pedidoId = dbRes.rows[0].id;

        return res.json({
          sucesso: true,
          pedidoId,
          paymentId,
          copiaECola: qrCode,
          qrCodeBase64: qrCodeBase64 ? `data:image/png;base64,${qrCodeBase64}` : '',
          ticketUrl,
          valor: valorNumerico,
          metodo: 'pix',
          oficial: true,
          mensagem: 'Pix gerado com sucesso via Mercado Pago Oficial!'
        });
      } catch (mpErr: any) {
        console.error('Erro na API Mercado Pago Pix:', mpErr);
        const msg = String(mpErr.message || '');
        let explicacao = msg;
        if (msg.includes('live credentials') || msg.includes('Unauthorized')) {
          explicacao = 'Credencial de Produção ainda não ativada no painel do Mercado Pago! No menu da sua aplicação, clique em "Ativar credenciais de produção" ou use o Access Token de Teste (que começa com TEST-) da aba "Credenciais de teste".';
        }
        return res.status(400).json({
          sucesso: false,
          mensagem: `Mercado Pago: ${explicacao}`
        });
      }
    }

    // Modo de Desenvolvimento (caso o Access Token ainda não esteja preenchido no .env)
    const dbRes = await query(`
      INSERT INTO pedidos (nick, email, discord, metodo, status, valor_total, itens)
      VALUES ($1, $2, $3, 'pix', 'PENDENTE', $4, $5)
      RETURNING id, criado_em
    `, [nick.trim(), emailLimpo, discord || '', valorNumerico, JSON.stringify(itens)]);

    const pedidoId = dbRes.rows[0].id;

    return res.json({
      sucesso: true,
      pedidoId,
      modoSimulado: true,
      oficial: false,
      copiaECola: `00020101021226840014br.gov.bcb.pix2562pix.twnetwork.com.br/qr/v2/dev_${pedidoId}520400005303986540${valorNumerico.toFixed(2)}5802BR5910TW Network6009Sao Paulo62070503***6304E6A7`,
      qrCodeBase64: '',
      valor: valorNumerico,
      metodo: 'pix',
      aviso: 'Configure o MERCADOPAGO_ACCESS_TOKEN no .env para ativar a geração bancária oficial.'
    });
  } catch (error: any) {
    console.error('Erro ao gerar Pix:', error);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao processar o Pix.' });
  }
});

// 6.1 Criar Checkout Mercado Pago para Cartão de Crédito, Boleto e Saldo
app.post('/api/checkout/mercado-pago', async (req, res) => {
  try {
    const { nick, email, discord, itens, valorTotal, metodo } = req.body;

    if (!nick || !valorTotal || !itens || itens.length === 0) {
      return res.status(400).json({ sucesso: false, mensagem: 'Dados incompletos para gerar o checkout.' });
    }

    const valorNumerico = Number(Number(valorTotal).toFixed(2));
    const mp = getMpClient();
    const emailLimpo = (email && email.includes('@')) ? email.trim() : 'comprador@twnetwork.com.br';

    if (!mp) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'MERCADOPAGO_ACCESS_TOKEN não encontrado no arquivo .env.'
      });
    }

    const preference = new Preference(mp);
    const itensFormatados = itens.map((it: any) => {
      let precoItem = extrairPreco(it.preco ?? it.price);
      if (precoItem <= 0) {
        precoItem = Number((valorNumerico / (itens.length || 1)).toFixed(2));
      }
      return {
        id: String(it.id || 'item'),
        title: String(it.nome || it.name || 'Pacote TW Network').substring(0, 250),
        quantity: Number(it.quantidade || 1),
        unit_price: Number(precoItem.toFixed(2)),
        currency_id: 'BRL'
      };
    });

    const prefResult = await preference.create({
      body: {
        items: itensFormatados,
        payer: {
          name: nick.trim(),
          email: emailLimpo
        },
        back_urls: {
          success: 'http://localhost:3000/conclusao',
          pending: 'http://localhost:3000/conclusao',
          failure: 'http://localhost:3000/carrinho'
        },
        statement_descriptor: 'TW NETWORK'
      }
    });

    const dbRes = await query(`
      INSERT INTO pedidos (nick, email, discord, metodo, status, valor_total, mp_payment_id, itens)
      VALUES ($1, $2, $3, $4, 'PENDENTE', $5, $6, $7)
      RETURNING id
    `, [nick.trim(), emailLimpo, discord || '', metodo || 'cartao', valorNumerico, prefResult.id, JSON.stringify(itens)]);

    const pedidoId = dbRes.rows[0].id;

    return res.json({
      sucesso: true,
      pedidoId,
      preferenceId: prefResult.id,
      initPoint: prefResult.init_point,
      sandboxInitPoint: prefResult.sandbox_init_point
    });
  } catch (error: any) {
    console.error('Erro na Preference do Mercado Pago:', error);
    return res.status(500).json({ sucesso: false, mensagem: `Mercado Pago: ${error.message || 'Erro ao gerar checkout'}` });
  }
});


// 6.2 Checkout Transparente: Cartão de Crédito 100% no Site
app.post('/api/checkout/cartao', async (req, res) => {
  try {
    const { nick, email, discord, itens, valorTotal, cartao } = req.body;

    if (!nick || !valorTotal || !itens || itens.length === 0 || !cartao) {
      return res.status(400).json({ sucesso: false, mensagem: 'Dados incompletos para processar o cartão.' });
    }

    const { numero, nomeTitular, mes, ano, cvv, cpf, parcelas } = cartao;
    if (!numero || !nomeTitular || !mes || !ano || !cvv || !cpf) {
      return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos do cartão de crédito.' });
    }

    const valorNumerico = Number(Number(valorTotal).toFixed(2));
    const mp = getMpClient();
    const emailLimpo = (email && email.includes('@')) ? email.trim() : 'comprador@twnetwork.com.br';

    if (!mp) {
      return res.status(400).json({ sucesso: false, mensagem: 'Mercado Pago não configurado no .env' });
    }

    // 1. Gera o Token do Cartão de forma segura com o Mercado Pago
    const cardToken = new CardToken(mp);
    const tokenRes = await cardToken.create({
      body: {
        card_number: String(numero).replace(/\D/g, ''),
        expiration_month: parseInt(String(mes), 10),
        expiration_year: parseInt(String(ano).length === 2 ? `20${ano}` : String(ano), 10),
        security_code: String(cvv).trim(),
        cardholder: {
          name: nomeTitular.trim(),
          identification: {
            type: 'CPF',
            number: String(cpf).replace(/\D/g, '')
          }
        }
      }
    });

    // 2. Cobra via Payment API utilizando o Token
    const payment = new Payment(mp);
    const paymentRes = await payment.create({
      body: {
        transaction_amount: valorNumerico,
        token: tokenRes.id,
        description: `TW Network RankUP - Jogador ${nick}`,
        installments: parseInt(String(parcelas || 1), 10),
        payer: {
          email: emailLimpo,
          first_name: nomeTitular.trim(),
          identification: {
            type: 'CPF',
            number: String(cpf).replace(/\D/g, '')
          }
        }
      }
    });

    const paymentId = String(paymentRes.id);
    const status = paymentRes.status === 'approved' ? 'APROVADO' : (paymentRes.status === 'in_process' ? 'PENDENTE' : 'RECUSADO');

    const usuarioId = extrairUsuarioId(req);
    // Salva no banco PostgreSQL
    const dbRes = await query(`
      INSERT INTO pedidos (usuario_id, nick, email, discord, metodo, status, valor_total, mp_payment_id, itens, pago_em)
      VALUES ($1, $2, $3, $4, 'cartao', $5, $6, $7, $8, ${status === 'APROVADO' ? 'CURRENT_TIMESTAMP' : 'NULL'})
      RETURNING id, criado_em
    `, [usuarioId, nick.trim(), emailLimpo, discord || '', status, valorNumerico, paymentId, JSON.stringify(itens)]);

    const pedidoId = dbRes.rows[0].id;

    if (status === 'APROVADO') {
      await entregarPedidoNoSite(pedidoId);
      return res.json({
        sucesso: true,
        aprovado: true,
        pedidoId,
        paymentId,
        status: 'APROVADO',
        valor: valorNumerico,
        mensagem: 'Pagamento com Cartão Aprovado e Benefícios Creditados na sua Conta!'
      });
    }

    if (status === 'PENDENTE') {
      return res.json({
        sucesso: true,
        aprovado: false,
        emAnalise: true,
        pedidoId,
        paymentId,
        status: 'PENDENTE',
        valor: valorNumerico,
        mensagem: 'Pagamento em análise de segurança pelo banco emissor.'
      });
    }

    // Se foi recusado pelo banco
    const detalhesRecusa: Record<string, string> = {
      cc_rejected_bad_filled_card_number: 'Número do cartão inválido.',
      cc_rejected_bad_filled_date: 'Data de validade incorreta.',
      cc_rejected_bad_filled_security_code: 'Código de segurança (CVV) incorreto.',
      cc_rejected_insufficient_amount: 'Saldo ou limite insuficiente no cartão.',
      cc_rejected_call_for_authorize: 'Autorize o pagamento junto ao seu banco emissor.',
      cc_rejected_card_disabled: 'O cartão está desabilitado no banco emissor.'
    };

    const motivo = detalhesRecusa[paymentRes.status_detail || ''] || 'Transação não autorizada pela operadora do cartão.';
    return res.status(400).json({ sucesso: false, mensagem: motivo });
  } catch (error: any) {
    console.error('Erro no checkout de cartão:', error);
    return res.status(400).json({
      sucesso: false,
      mensagem: error.message || 'Falha ao processar pagamento com cartão de crédito.'
    });
  }
});

// 6.3 Checkout Transparente: Boleto Bancário 100% no Site
app.post('/api/checkout/boleto', async (req, res) => {
  try {
    const { nick, email, discord, itens, valorTotal, boleto } = req.body;

    if (!nick || !valorTotal || !itens || itens.length === 0 || !boleto) {
      return res.status(400).json({ sucesso: false, mensagem: 'Dados incompletos para gerar o boleto.' });
    }

    const { nome, cpf } = boleto;
    if (!nome || !cpf) {
      return res.status(400).json({ sucesso: false, mensagem: 'Informe o Nome Completo e CPF para emissão do boleto.' });
    }

    const valorNumerico = Number(Number(valorTotal).toFixed(2));
    const mp = getMpClient();
    const emailLimpo = (email && email.includes('@')) ? email.trim() : 'comprador@twnetwork.com.br';

    if (!mp) {
      return res.status(400).json({ sucesso: false, mensagem: 'Mercado Pago não configurado no .env' });
    }

    const partesNome = nome.trim().split(' ');
    const primeiroNome = partesNome[0] || nick;
    const sobrenome = partesNome.slice(1).join(' ') || 'Jogador';

    const payment = new Payment(mp);
    const mpResponse = await payment.create({
      body: {
        transaction_amount: valorNumerico,
        description: `TW Network RankUP - Boleto de ${nick}`,
        payment_method_id: 'bolbradesco',
        payer: {
          email: emailLimpo,
          first_name: primeiroNome,
          last_name: sobrenome,
          identification: {
            type: 'CPF',
            number: String(cpf).replace(/\D/g, '')
          }
        }
      }
    });

    const paymentId = String(mpResponse.id);
    const linhaDigitavel = mpResponse.barcode?.content || '';
    const pdfUrl = mpResponse.transaction_details?.external_resource_url || '';

    const usuarioId = extrairUsuarioId(req);
    // Salva o boleto no PostgreSQL
    const dbRes = await query(`
      INSERT INTO pedidos (usuario_id, nick, email, discord, metodo, status, valor_total, mp_payment_id, pix_copia_cola, itens)
      VALUES ($1, $2, $3, $4, 'boleto', 'PENDENTE', $5, $6, $7, $8)
      RETURNING id, criado_em
    `, [usuarioId, nick.trim(), emailLimpo, discord || '', valorNumerico, paymentId, linhaDigitavel, JSON.stringify(itens)]);

    const pedidoId = dbRes.rows[0].id;

    return res.json({
      sucesso: true,
      pedidoId,
      paymentId,
      linhaDigitavel,
      pdfUrl,
      valor: valorNumerico,
      metodo: 'boleto',
      mensagem: 'Boleto bancário gerado com sucesso!'
    });
  } catch (error: any) {
    console.error('Erro ao gerar Boleto no Mercado Pago:', error);
    return res.status(400).json({
      sucesso: false,
      mensagem: error.message || 'Erro ao emitir boleto bancário.'
    });
  }
});

// 7. Consultar Status do Pedido (com checagem ativa no Mercado Pago e Entrega Automática)
app.get('/api/pedidos/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    if (isNaN(idNum)) {
      return res.status(400).json({ sucesso: false, mensagem: 'ID de pedido inválido.' });
    }
    const resultado = await query('SELECT * FROM pedidos WHERE id = $1', [idNum]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Pedido não encontrado.' });
    }

    const pedido = resultado.rows[0];

    // Checagem ativa caso o pedido ainda conste como PENDENTE
    const mp = getMpClient();
    if (pedido.status === 'PENDENTE' && pedido.mp_payment_id && mp) {
      try {
        const payment = new Payment(mp);
        const mpInfo = await payment.get({ id: pedido.mp_payment_id });
        if (mpInfo.status === 'approved') {
          await entregarPedidoNoSite(pedido.id);
          pedido.status = 'ENTREGUE';
          pedido.pago_em = new Date();
          console.log(`⚡ [POLLING MERCADO PAGO] Pedido #${pedido.id} aprovado e entregue instantaneamente!`);
        }
      } catch {
        // Ignora erro passageiro de consulta
      }
    }

    return res.json({ sucesso: true, pedido });
  } catch (error: any) {
    console.error('Erro ao consultar status:', error);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao consultar pedido.' });
  }
});

// 7.1 Validação de Cupons de Desconto pelo PostgreSQL
app.post('/api/cupons/validar', async (req, res) => {
  try {
    const { codigo } = req.body;
    if (!codigo || typeof codigo !== 'string') {
      return res.status(400).json({ sucesso: false, mensagem: 'Informe o código do cupom.' });
    }

    const codigoLimpo = codigo.trim().toUpperCase();
    const busca = await query(
      'SELECT * FROM cupons WHERE UPPER(codigo) = $1 AND ativo = true',
      [codigoLimpo]
    );

    if (busca.rows.length === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Cupom inválido ou expirado.' });
    }

    const cupom = busca.rows[0];
    return res.json({
      sucesso: true,
      cupom: {
        codigo: cupom.codigo.toUpperCase(),
        descontoPercentual: cupom.desconto_percentual,
        desconto: cupom.desconto_percentual / 100
      }
    });
  } catch (err: any) {
    console.error('Erro ao validar cupom:', err);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro ao consultar cupom.' });
  }
});

// 7.2 Histórico Real de Pedidos do Jogador (PostgreSQL - A01: Protegido contra IDOR)
app.get('/api/pedidos/historico', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        sucesso: false, 
        mensagem: 'Acesso negado: faça login para consultar seus pedidos.' 
      });
    }

    const token = authHeader.split(' ')[1];
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(401).json({ 
        sucesso: false, 
        mensagem: 'Sessão inválida ou expirada. Faça login novamente.' 
      });
    }

    const usuarioId = payload.id;
    const buscaNick = (payload.nick || '').toLowerCase();
    const buscaEmail = (payload.email || '').toLowerCase();

    // Consulta estritamente os pedidos do usuário autenticado no JWT
    const resultado = await query(`
      SELECT * FROM pedidos 
      WHERE (usuario_id IS NOT NULL AND usuario_id = $1)
         OR LOWER(nick) = LOWER($2)
         OR (LOWER(email) = LOWER($3) AND $3 != '')
      ORDER BY criado_em DESC
    `, [usuarioId, buscaNick, buscaEmail]);

    const formatados = resultado.rows.map(row => {
      const itensArray = Array.isArray(row.itens) ? row.itens : [];
      const resumoPacote = itensArray.length > 0 
        ? itensArray.map((it: any) => `${it.nome || 'Item'} ${it.quantidade > 1 ? `(${it.quantidade}x)` : ''}`).join(' + ')
        : `Pedido #${row.id}`;

      const mcIcon = itensArray[0]?.mcIcon || 'Emerald';

      let statusTexto = 'Aguardando Pagamento';
      const st = String(row.status || '').toUpperCase();
      if (st === 'APROVADO') statusTexto = 'Pagamento Aprovado';
      else if (st === 'ENTREGUE') statusTexto = 'Entregue & Ativado';
      else if (st === 'RECUSADO') statusTexto = 'Recusado / Cancelado';

      const metodoTexto = row.metodo === 'pix' 
        ? 'Pix Instantâneo' 
        : (row.metodo === 'cartao' ? 'Cartão de Crédito' : (row.metodo === 'boleto' ? 'Boleto Bancário' : 'Outro'));

      return {
        id: `TW-${row.id}`,
        numeroId: row.id,
        nick: row.nick,
        email: row.email,
        metodo: row.metodo,
        metodoTexto,
        status: st.toLowerCase(), // 'pendente', 'aprovado', 'entregue', 'recusado'
        statusTexto,
        valor: `R$ ${Number(row.valor_total).toFixed(2).replace('.', ',')}`,
        valorNumerico: Number(row.valor_total),
        data: new Date(row.criado_em).toLocaleDateString('pt-BR') + ' às ' + new Date(row.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        pagoEm: row.pago_em ? new Date(row.pago_em).toLocaleDateString('pt-BR') + ' às ' + new Date(row.pago_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null,
        pacote: resumoPacote,
        itens: itensArray,
        mcIcon,
        pixCopiaCola: row.pix_copia_cola,
        pixQrCodeBase64: row.pix_qr_code_base64,
        codigoAtivacao: `TW-${row.id}-${row.nick.toUpperCase()}`,
        comando: st === 'APROVADO' || st === 'ENTREGUE' ? `/ativar TW-${row.id}-${row.nick.toUpperCase()}` : null
      };
    });

    return res.json({ sucesso: true, pedidos: formatados });
  } catch (error) {
    console.error('Erro ao consultar histórico de pedidos:', error);
    return res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao consultar pedidos.' });
  }
});

// 8. Webhook do Mercado Pago (Recebe a confirmação automática de pagamento)
app.post('/api/webhooks/mercadopago', async (req, res) => {
  try {
    const { type, data } = req.body;

    const mp = getMpClient();
    if (type === 'payment' && data?.id && mp) {
      const payment = new Payment(mp);
      const paymentInfo = await payment.get({ id: data.id });

      if (paymentInfo.status === 'approved') {
        const paymentId = String(paymentInfo.id);

        const pRes = await query('SELECT id FROM pedidos WHERE mp_payment_id = $1', [paymentId]);
        if (pRes.rows.length > 0) {
          const pedidoId = pRes.rows[0].id;
          await entregarPedidoNoSite(pedidoId);
          console.log(`💰 [MERCADO PAGO WEBHOOK] Pagamento #${paymentId} (Pedido #${pedidoId}) APROVADO e entregue!`);
        }
      }
    }

    return res.status(200).send('OK');
  } catch (error: any) {
    console.error('Erro no webhook do Mercado Pago:', error);
    return res.status(500).send('Erro');
  }
});

// 9. Status do Sistema / Health
app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    return res.json({
      status: 'ok',
      rede: 'TW Network',
      modo: 'full-stack',
      banco: 'PostgreSQL Conectado',
      mercadoPago: Boolean(getMpClient())
    });
  } catch (err: any) {
    console.error('❌ [HEALTHCHECK] Falha na conexão com o banco de dados:', err?.message || err);
    return res.status(500).json({
      status: 'error',
      mensagem: 'Banco de dados inacessível'
    });
  }
});

/* ==========================================================================
   INICIALIZAÇÃO DO SERVIDOR COM VITE MIDDLEWARE
   ========================================================================== */
async function iniciarServidor() {
  await inicializarBanco();

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('{*splat}', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor Full-Stack TW Network online em http://localhost:${PORT}`);
  });
}

iniciarServidor();
