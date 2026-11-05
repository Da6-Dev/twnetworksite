export const serverInfo = {
  ip: "TWNetwork.com.br",
  versao: "1.8.x - 1.20.x",
  totalOnline: 148,
  capacidadeMaxima: 500,
  modos: [
    {
      id: 1,
      nome: "RankUP Natal (Principal)",
      descricao: "Complexo de 11 minas temáticas, 3 minas VIP exclusivas, economia exponencial e progressão até Noel.",
      jogadores: 104,
      maxJogadores: 350,
      online: true,
      tipo: "Principal",
      mcIcon: "Diamond_Pickaxe"
    },
    {
      id: 2,
      nome: "Mina PvP & Arenas",
      descricao: "Mundo de extração de alto risco em vácuo, combate 1.8 sem delay e proteção CombatLog ao minerar.",
      jogadores: 28,
      maxJogadores: 100,
      online: true,
      tipo: "Competitivo",
      mcIcon: "Netherite_Sword"
    },
    {
      id: 3,
      nome: "Mundo Terrenos (Plots)",
      descricao: "Lotes industriais 42x42 com máquinas industriais, silos automáticos e limite de até 25 geradores.",
      jogadores: 16,
      maxJogadores: 150,
      online: true,
      tipo: "Indústria",
      mcIcon: "Grass_Block"
    },
    {
      id: 4,
      nome: "Lobby Principal",
      descricao: "Hub central com void generator, NPC menus, hologramas e central de caixas misteriosas.",
      jogadores: 12,
      maxJogadores: 100,
      online: true,
      tipo: "Hub",
      mcIcon: "Beacon"
    }
  ]
};

export const ranksNatalinos = [
  {
    id: 'carvao',
    nome: 'Carvão',
    tag: '[Carvão]',
    tagCor: '#95a5a6',
    proximo: 'NEVE',
    custo: 'R$ 0,00 (Inicial)',
    broadcast: false,
    mcIcon: 'Fire_Charge',
    vantagens: 'Acesso à Mina Carvão e liberação de Máquina Industrial de Carvão.'
  },
  {
    id: 'neve',
    nome: 'Neve',
    tag: '[Neve]',
    tagCor: '#ecf0f1',
    proximo: 'SINO',
    custo: 'R$ 25.000,00',
    broadcast: false,
    mcIcon: 'Paper',
    vantagens: 'Acesso à Mina Neve, Spawner de Vaca, Máquina Industrial de Neve.'
  },
  {
    id: 'sino',
    nome: 'Sino',
    tag: '[Sino]',
    tagCor: '#f1c40f',
    proximo: 'BISCOITO',
    custo: 'R$ 800.000,00',
    broadcast: false,
    mcIcon: 'Gold_Nugget',
    vantagens: 'Acesso à Mina Sino, Spawner de Aranha, Máquina Industrial Sino.'
  },
  {
    id: 'biscoito',
    nome: 'Biscoito',
    tag: '[Biscoito]',
    tagCor: '#e67e22',
    proximo: 'DUENDE',
    custo: 'R$ 25.000.000,00 ($2.5E7)',
    broadcast: false,
    mcIcon: 'Bread',
    vantagens: 'Acesso à Mina Biscoito, Spawner Zumbi, Máquina Biscoito e Correio: 1x Diamante.'
  },
  {
    id: 'duende',
    nome: 'Duende',
    tag: '[Duende]',
    tagCor: '#2ecc71',
    proximo: 'RENA',
    custo: 'R$ 500.000.000,00 ($5.0E8)',
    broadcast: true,
    mcIcon: 'Emerald',
    vantagens: 'Mina Duende, Spawner Blaze, Máquina Duende, Correio: 5x Esmeraldas + Anúncio Global.'
  },
  {
    id: 'rena',
    nome: 'Rena',
    tag: '[Rena]',
    tagCor: '#e74c3c',
    proximo: 'TRENO',
    custo: 'R$ 15.000.000.000,00 ($1.5E10)',
    broadcast: true,
    mcIcon: 'Bone',
    vantagens: 'Mina Rena, Spawner Iron Golem, Máquina Rena + Anúncio Global.'
  },
  {
    id: 'treno',
    nome: 'Trenó',
    tag: '[Trenó]',
    tagCor: '#c0392b',
    proximo: 'QUEBRANOZES',
    custo: 'R$ 500.000.000.000,00 ($5.0E11)',
    broadcast: true,
    mcIcon: 'Chest',
    vantagens: 'Mina Trenó com blocos nobres de quartzo e esmeralda + Anúncio Global.'
  },
  {
    id: 'quebranozes',
    nome: 'Quebra-Nozes',
    tag: '[Quebra-Nozes]',
    tagCor: '#9b59b6',
    proximo: 'ESTRELA',
    custo: 'R$ 20.000.000.000.000,00 ($2.0E13)',
    broadcast: true,
    mcIcon: 'Diamond_Helmet',
    vantagens: 'Mina Quebra-Nozes com cotações de alta renda + Anúncio Global.'
  },
  {
    id: 'estrela',
    nome: 'Estrela',
    tag: '[Estrela]',
    tagCor: '#f39c12',
    proximo: 'NOEL',
    custo: 'R$ 800.000.000.000.000,00 ($8.0E14)',
    broadcast: true,
    mcIcon: 'Nether_Star',
    vantagens: 'Mina Estrela com Deepslate e prismarine nobre + Anúncio Global.'
  },
  {
    id: 'noel',
    nome: 'Noel',
    tag: '[Noel]',
    tagCor: '#e74c3c',
    proximo: 'MAX',
    custo: 'R$ 15.000.000.000.000.000,00 ($1.5E16)',
    broadcast: true,
    mcIcon: 'Beacon',
    vantagens: 'Mina Noel, Máquina Noel Beacon, Farm de Fungo, Recompensa $1.000.000 + Anúncio Global.'
  },
  {
    id: 'max',
    nome: 'MAX',
    tag: '[MAX]',
    tagCor: '#d35400',
    proximo: 'PRESTÍGIO',
    custo: 'Nível Máximo Alcançado',
    broadcast: true,
    mcIcon: 'Totem_Of_Undying',
    vantagens: 'Desbloqueia a transição para os Prestígios End Game (/prestigio).'
  }
];

export const prestigiosEndGame = [
  {
    id: 'grinch',
    nome: 'Grinch',
    tag: '[Grinch]',
    tagCor: '#27ae60',
    custo: 'R$ 50 Quadrilhões ($5.0E16)',
    multiplicador: '1.5x Multiplicador',
    sorteCaixas: '+25% Sorte em Caixas',
    mcIcon: 'Experience_Bottle',
    descricao: 'Primeiro ciclo de Prestígio. Reseta ranks lineares mantendo multiplicador 1.5x permanente.'
  },
  {
    id: 'yeti',
    nome: 'Yeti',
    tag: '[Yeti]',
    tagCor: '#3498db',
    custo: 'R$ 200 Quadrilhões ($2.0E17)',
    multiplicador: '2.0x Multiplicador',
    sorteCaixas: '+50% Sorte em Caixas',
    mcIcon: 'Diamond',
    descricao: 'Segundo ciclo de Prestígio. Dobra todo rendimento de venda in-game e amplifica recompensas raras.'
  },
  {
    id: 'krampus',
    nome: 'Krampus',
    tag: '[Krampus]',
    tagCor: '#8e44ad',
    custo: 'R$ 800 Quadrilhões ($8.0E17)',
    multiplicador: '3.0x Multiplicador',
    sorteCaixas: '+100% Sorte (2.0x Dobro)',
    mcIcon: 'Netherite_Sword',
    descricao: 'Ápice máximo do servidor. Triplica todas as vendas e concede taxa máxima de itens divinos em caixas.'
  }
];

export const planosVipOficiais = [
  {
    id: 1,
    nome: 'VIP Festivo',
    tag: '[Festivo]',
    preco: 'R$ 19,90',
    valor: 19.9,
    destaque: false,
    mcIcon: 'Gold_Ingot',
    descricao: 'Ideal para quem está iniciando na temporada festiva e busca impulso na mineração e terrenos.',
    beneficios: [
      'Tag Exclusiva [Festivo] destacada no chat e tab',
      'Canal VIP Exclusivo (/vc) entre os jogadores vips',
      'Acesso à Mina VIP Festivo (com Nether Gold Ore)',
      '+25% de Bônus multiplicador em todas as vendas (/sell)',
      'Kit Semanal VIP Festivo com armaduras e ferramentas',
      'Comando /fly liberado nos terrenos industriais',
      '3 Lotes de terrenos adicionais protegidos no /terrenos',
      '1x Chave Festiva bônus por semana via /correio'
    ]
  },
  {
    id: 2,
    nome: 'VIP Nevasca',
    tag: '[Nevasca]',
    preco: 'R$ 39,90',
    valor: 39.9,
    destaque: true,
    mcIcon: 'Emerald',
    descricao: 'O plano mais procurado da temporada! Acesso a duas minas VIPs, voo expandido e reparo ilimitado.',
    beneficios: [
      'Tag Exclusiva [Nevasca] com cor temática natalina',
      'Canal VIP Exclusivo (/vc) e prioridade na fila',
      'Acesso às Minas VIP Festivo e VIP Nevasca (Nether Quartz Ore)',
      '+50% de Bônus multiplicador em todas as vendas',
      'Kit Diário e Semanal VIP Nevasca reforçado',
      'Comando /fly liberado nos lobbys e terrenos',
      'Comando /reparar sem tempo de espera e sem custo',
      '5 Lotes de terrenos no mundo industrial (PlotSquared)',
      '2x Chaves Nevadas bônus por semana no correio'
    ]
  },
  {
    id: 3,
    nome: 'VIP Polar',
    tag: '[Polar]',
    preco: 'R$ 69,90',
    valor: 69.9,
    destaque: false,
    mcIcon: 'Nether_Star',
    descricao: 'Supremacia total na TW Network. Acesso à lendária Mina Polar com Ancient Debris e maior bônus de venda.',
    beneficios: [
      'Tag Exclusiva [Polar] com efeito especial de destaque',
      'Acesso irrestrito a todas as Minas VIPs (incluindo Mina Polar com Ancient Debris)',
      'Canal VIP (/vc) e entrada garantida mesmo com servidor 100% lotado',
      '+100% de Bônus máximo (2.0x) em todas as vendas de minérios',
      'Todos os kits VIP liberados permanentemente',
      'Comando /fly irrestrito em todas as áreas autorizadas',
      'Comandos /reparar, /feed e /hat liberados no chat',
      '10 Lotes de terrenos industriais para megaprojetos de máquinas',
      '1x Chave Divina Semanal com chance de Orbe de Prestígio'
    ]
  }
];

export const pacotesChavesOficiais = [
  {
    id: 201,
    nome: '3x Chaves Festivas',
    preco: 'R$ 12,00',
    valor: 12.0,
    mcIcon: 'Tripwire_Hook',
    bonus: null,
    descricao: 'Abra a Caixa Misteriosa no spawn para obter armaduras reforçadas, ferramentas e tokens de spawner.'
  },
  {
    id: 202,
    nome: '5x Chaves Nevadas',
    preco: 'R$ 22,00',
    valor: 22.0,
    mcIcon: 'Amethyst_Shard',
    bonus: 'Mais Vendido',
    descricao: 'Maior probabilidade de máquinas industriais avançadas, boosters de venda e equipamentos lendários.'
  },
  {
    id: 203,
    nome: 'Combo Caixa Divina (1 Divina + 5 Nevadas)',
    preco: 'R$ 39,90',
    valor: 39.9,
    mcIcon: 'Ender_Chest',
    bonus: 'Chance Lendária',
    descricao: 'Acesso à Caixa Divina com Pity System garantido e chance de obter o Selo da Fortuna e Orbe de Prestígio.'
  }
];
