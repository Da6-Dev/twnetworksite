import React, { useState } from 'react';
import './CommunityCenter.css';
import McIcon from './McIcon';

export default function CommunityCenter() {
  const [secaoAtiva, setSecaoAtiva] = useState('faq');
  const [perguntaAberta, setPerguntaAberta] = useState(1);
  const [categoriaRegra, setCategoriaRegra] = useState('geral');
  const [avisoCandidatura, setAvisoCandidatura] = useState(false);

  // FAQs
  const faqs = [
    {
      id: 1,
      mcIcon: 'Clock',
      pergunta: 'Quanto tempo demora para receber meu VIP ou Cash após o pagamento?',
      resposta: 'Os pagamentos via Pix são aprovados de forma instantânea e os benefícios são ativados na sua conta do jogo em menos de 1 minuto por entrega automatizada. Para pagamentos em Cartão de Crédito, a liberação ocorre imediatamente após a confirmação pela operadora.'
    },
    {
      id: 2,
      mcIcon: 'Gold_Ingot',
      pergunta: 'Como funcionam os pagamentos dos prêmios em dinheiro real (Pix)?',
      resposta: 'No encerramento de cada temporada (todos os domingos às 23h59), nossa equipe valida o ranking oficial dos primeiros colocados no RankUP. Entramos em contato com os vencedores no Discord e efetuamos a transferência bancária direta via chave Pix em até 24 horas.'
    },
    {
      id: 3,
      mcIcon: 'Compass',
      pergunta: 'Quais versões do Minecraft são compatíveis com a TW Network?',
      resposta: 'O servidor aceita conexões desde a versão 1.8 até a versão 1.20+ mais recente. Recomendamos utilizar a versão 1.8.9 ou 1.20 com Lunar Client, Badlion ou OptiFine para obter a máxima taxa de FPS.'
    },
    {
      id: 4,
      mcIcon: 'Book',
      pergunta: 'Comprei para o Nick errado por engano. O que devo fazer?',
      resposta: 'Basta abrir um ticket no nosso Discord Oficial com o comprovante do pagamento e informar o Nick correto antes dos itens serem resgatados no jogo. Nossa equipe de suporte realiza a transferência manual da licença para você.'
    },
    {
      id: 5,
      mcIcon: 'Emerald',
      pergunta: 'O servidor aceita contas originais e não-originais (piratas)?',
      resposta: 'Sim! A TW Network possui sistema de autenticação híbrida inteligente. Usuários de Minecraft original contam com auto-login seguro via Mojang/Microsoft, enquanto jogadores com clientes não-originais utilizam /register e /login.'
    }
  ];

  // Regras
  const categoriasRegras = [
    { id: 'geral', nome: 'Conduta & Chat', mcIcon: 'Paper' },
    { id: 'hacks', nome: 'Trapaças & Mods', mcIcon: 'Barrier' },
    { id: 'economia', nome: 'Economia & Trocas', mcIcon: 'Gold_Ingot' },
    { id: 'terrenos', nome: 'Terrenos & Lotes', mcIcon: 'Grass_Block' }
  ];

  const regrasPorCategoria = {
    geral: [
      {
        infracao: 'Ofensas, assédio ou preconceito',
        detalhe: 'Qualquer discurso de ódio, desrespeito religioso, preconceito ou ataques a jogadores e equipe.',
        punicao: 'Mute de 24h até Ban Permanente',
        nivel: 'critico'
      },
      {
        infracao: 'Divulgação de outros servidores',
        detalhe: 'Mencionar IPs, links de comunidades externas ou propagandas não autorizadas.',
        punicao: 'Banimento Permanente Imediato',
        nivel: 'critico'
      },
      {
        infracao: 'Spam e Flood no chat global',
        detalhe: 'Envio repetitivo de mensagens idênticas ou uso abusivo de maiúsculas.',
        punicao: 'Aviso Verbal → Mute de 2h',
        nivel: 'leve'
      }
    ],
    hacks: [
      {
        infracao: 'Clientes modificados (KillAura, Fly, Speed, X-Ray)',
        detalhe: 'Qualquer script ou programa externo que proporcione vantagens injustas.',
        punicao: 'Ban Permanente da Conta e IP',
        nivel: 'critico'
      },
      {
        infracao: 'Aproveitamento de Bugs ou Duplicação (Duping)',
        detalhe: 'Tirar proveito de falhas da economia ou mapa sem reportar imediatamente.',
        punicao: 'Ban Permanente + Reset da Conta',
        nivel: 'critico'
      },
      {
        infracao: 'Autoclick / Macro acima de 16 CPS',
        detalhe: 'Uso de cliques automáticos acima do limite de segurança do servidor.',
        punicao: 'Ban Temporário (7 dias)',
        nivel: 'medio'
      }
    ],
    economia: [
      {
        infracao: 'Comércio externo não autorizado (RMT)',
        detalhe: 'Vender moedas in-game por dinheiro real fora dos canais oficiais.',
        punicao: 'Ban Permanente de Todas as Contas',
        nivel: 'critico'
      },
      {
        infracao: 'Golpes ou Calotes (Scam)',
        detalhe: 'Enganar jogadores em trocas falsas ou leilões fictícios.',
        punicao: 'Ban Temporário (14 dias) + Devolução',
        nivel: 'medio'
      }
    ],
    terrenos: [
      {
        infracao: 'Griefing ou bloqueio de acessos públicos',
        detalhe: 'Construir armadilhas involuntárias ou bloquear visualmente lotes adjacentes.',
        punicao: 'Remoção da Estrutura + Aviso',
        nivel: 'leve'
      },
      {
        infracao: 'Construções inadequadas ou símbolos ofensivos',
        detalhe: 'Representação de símbolos ofensivos ou conteúdos desrespeitosos.',
        punicao: 'Ban de 3 dias + Limpeza do Lote',
        nivel: 'medio'
      }
    ]
  };

  // Equipe
  const membros = [
    {
      nick: 'TeDabliukkkkk',
      cargo: 'Fundador & Desenvolvedor',
      classe: 'fundador',
      mcIcon: 'Nether_Star',
      desc: 'Gestão geral da infraestrutura, arquitetura de plugins e balanceamento econômico.'
    },
    {
      nick: 'AdminTW',
      cargo: 'Administrador Geral',
      classe: 'admin',
      mcIcon: 'Diamond_Sword',
      desc: 'Supervisão de eventos sazonais, suporte à loja e coordenação da equipe.'
    },
    {
      nick: 'ModCraft',
      cargo: 'Moderador Sênior',
      classe: 'mod',
      mcIcon: 'Iron_Sword',
      desc: 'Fiscalização ativa de denúncias, aplicação das diretrizes e combate a hacks.'
    },
    {
      nick: 'AjudanteTW',
      cargo: 'Ajudante & Suporte',
      classe: 'ajudante',
      mcIcon: 'Golden_Apple',
      desc: 'Boas-vindas a novos jogadores e esclarecimento de dúvidas no chat e tickets.'
    }
  ];

  return (
    <section id="comunidade" className="community-center-section">
      <div className="community-header">
        <span className="badge-secao-comunidade">
          <McIcon name="Book" size={16} />
          Central da Comunidade
        </span>
        <h2>Suporte, <span className="highlight">Regras & Equipe</span></h2>
        <p>Tudo o que você precisa saber sobre o regulamento, suporte e administração da TW Network em um só lugar.</p>
      </div>

      {/* Navegador das 3 abas institucionais */}
      <div className="community-tabs">
        <button
          type="button"
          className={`comm-tab-btn ${secaoAtiva === 'faq' ? 'ativo' : ''}`}
          onClick={() => setSecaoAtiva('faq')}
        >
          <McIcon name="Compass" size={18} />
          <span>Dúvidas Frequentes (FAQ)</span>
        </button>

        <button
          type="button"
          className={`comm-tab-btn ${secaoAtiva === 'regras' ? 'ativo' : ''}`}
          onClick={() => setSecaoAtiva('regras')}
        >
          <McIcon name="Paper" size={18} />
          <span>Diretrizes & Regras</span>
        </button>

        <button
          type="button"
          className={`comm-tab-btn ${secaoAtiva === 'equipe' ? 'ativo' : ''}`}
          onClick={() => setSecaoAtiva('equipe')}
        >
          <McIcon name="Nether_Star" size={18} />
          <span>Equipe & Recrutamento</span>
        </button>
      </div>

      <div className="community-content-box">
        {/* ABA FAQ */}
        {secaoAtiva === 'faq' && (
          <div className="comm-faq-lista">
            {faqs.map((faq) => {
              const isAberta = perguntaAberta === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`comm-faq-item ${isAberta ? 'aberto' : ''}`}
                  onClick={() => setPerguntaAberta(isAberta ? null : faq.id)}
                >
                  <div className="comm-faq-pergunta">
                    <div className="comm-faq-tit-box">
                      <div className="comm-icon-circulo">
                        <McIcon name={faq.mcIcon} size={18} />
                      </div>
                      <h3>{faq.pergunta}</h3>
                    </div>
                    <span className="comm-faq-seta">{isAberta ? '−' : '+'}</span>
                  </div>
                  {isAberta && (
                    <div className="comm-faq-resposta">
                      <p>{faq.resposta}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ABA REGRAS */}
        {secaoAtiva === 'regras' && (
          <div className="comm-regras-box">
            <div className="comm-subtabs-regras">
              {categoriasRegras.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`comm-subtab-btn ${categoriaRegra === cat.id ? 'ativa' : ''}`}
                  onClick={() => setCategoriaRegra(cat.id)}
                >
                  <McIcon name={cat.mcIcon} size={16} />
                  <span>{cat.nome}</span>
                </button>
              ))}
            </div>

            <div className="comm-regras-cards">
              {regrasPorCategoria[categoriaRegra].map((r, i) => (
                <div key={i} className="comm-regra-card">
                  <div className="comm-regra-topo">
                    <h4>{r.infracao}</h4>
                    <span className={`comm-punicao-badge ${r.nivel}`}>{r.punicao}</span>
                  </div>
                  <p>{r.detalhe}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA EQUIPE */}
        {secaoAtiva === 'equipe' && (
          <div className="comm-staff-box">
            <div className="comm-staff-grid">
              {membros.map((m, idx) => (
                <div key={idx} className="comm-staff-card">
                  <div className="comm-staff-avatar">
                    <img
                      src={`https://mc-heads.net/avatar/${m.nick}/70`}
                      alt={m.nick}
                      style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
                    />
                  </div>
                  <h4>{m.nick}</h4>
                  <span className={`comm-role-badge ${m.classe}`}>
                    <McIcon name={m.mcIcon} size={14} />
                    {m.cargo}
                  </span>
                  <p>{m.desc}</p>
                </div>
              ))}
            </div>

            <div className="comm-recrutamento-banner">
              <div className="comm-recrutamento-info">
                <h4>Quer fazer parte da equipe da TW Network?</h4>
                <p>Buscamos constantemente jogadores maduros e prestativos para suporte no chat e atendimento de tickets.</p>
                {avisoCandidatura && (
                  <div className="comm-recrutamento-requisitos">
                    ℹ️ Formulários oficiais e requisitos completos (mínimo 15 anos) são abertos na sala <code>#recrutamento</code> do Discord.
                  </div>
                )}
              </div>
              <button
                type="button"
                className="btn-comm-candidatura"
                onClick={() => setAvisoCandidatura(!avisoCandidatura)}
              >
                <McIcon name={avisoCandidatura ? 'Barrier' : 'Paper'} size={16} />
                {avisoCandidatura ? 'Ocultar' : 'Ver Inscrição'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
