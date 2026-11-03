import React, { useState } from 'react';
import McIcon from './McIcon';
import './RegrasSection.css';

export default function RegrasSection() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('geral');

  const categorias = [
    { id: 'geral', nome: 'Conduta & Chat', mcIcon: 'Paper' },
    { id: 'hacks', nome: 'Trapaças & Clientes', mcIcon: 'Barrier' },
    { id: 'economia', nome: 'Economia & Comércio', mcIcon: 'Gold_Ingot' },
    { id: 'terrenos', nome: 'Terrenos & Clãs', mcIcon: 'Grass_Block' }
  ];

  const regrasPorCategoria = {
    geral: [
      {
        infracao: 'Ofensas, assédio ou qualquer discriminação',
        detalhe: 'Qualquer discurso de ódio, desrespeito religioso, preconceito racial ou ataques pessoais a jogadores e membros da equipe.',
        punicao: 'Mute de 24h até Banimento Permanente',
        nivel: 'critico'
      },
      {
        infracao: 'Divulgação de outros servidores de Minecraft',
        detalhe: 'Mencionar endereços de IP, links de comunidades externas ou fazer propaganda não autorizada em qualquer canal.',
        punicao: 'Banimento Permanente Imediato',
        nivel: 'critico'
      },
      {
        infracao: 'Spam e Flood sistemático no chat global',
        detalhe: 'Envio repetitivo de mensagens, uso abusivo de maiúsculas (Caps Lock) ou poluição visual deliberada.',
        punicao: 'Aviso Verbal → Mute Temporário de 2h',
        nivel: 'leve'
      }
    ],
    hacks: [
      {
        infracao: 'Uso de Clientes Modificados (KillAura, Fly, Speed, X-Ray)',
        detalhe: 'Qualquer mod, script ou programa externo que proporcione vantagens injustas em combates, mineração ou locomoção.',
        punicao: 'Banimento Permanente da Conta e IP',
        nivel: 'critico'
      },
      {
        infracao: 'Aproveitamento de Bugs ou Duplicação de Itens (Duping)',
        detalhe: 'Descobrir falhas da economia ou do mapa e utilizá-las em benefício próprio em vez de reportar imediatamente à equipe.',
        punicao: 'Ban Permanente + Reset Total da Conta',
        nivel: 'critico'
      },
      {
        infracao: 'Macro ou Autoclick com taxa de CPS abusiva',
        detalhe: 'Utilização de cliques automáticos acima do limite de 16 CPS estabelecido para segurança e equilíbrio do combate.',
        punicao: 'Banimento Temporário (7 dias)',
        nivel: 'medio'
      }
    ],
    economia: [
      {
        infracao: 'Comércio externo não autorizado (RMT)',
        detalhe: 'Vender moedas do servidor ou itens por dinheiro real fora dos canais oficiais da loja ou sem autorização da administração.',
        punicao: 'Banimento Permanente de Todas as Contas Envolvidas',
        nivel: 'critico'
      },
      {
        infracao: 'Golpes, Calotes e Enganações (Scam)',
        detalhe: 'Prometer itens e roubar moedas, forjar leilões ou enganar novos jogadores em transações comerciais.',
        punicao: 'Ban Temporário (14 dias) + Devolução Obrigatória dos Bens',
        nivel: 'medio'
      }
    ],
    terrenos: [
      {
        infracao: 'Griefing ou invasão de terrenos protegidos',
        detalhe: 'Construir estruturas com intenção de prender jogadores, bloquear entradas públicas ou atrapalhar lotes vizinhos.',
        punicao: 'Remoção da Estrutura + Advertência Formal',
        nivel: 'leve'
      },
      {
        infracao: 'Construções inadequadas ou símbolos ofensivos',
        detalhe: 'Erguer construções de teor preconceituoso, ofensivo ou vulgar em qualquer setor do mapa.',
        punicao: 'Banimento de 3 dias + Limpeza do Terreno',
        nivel: 'medio'
      }
    ]
  };

  return (
    <section id="regras" className="regras-section">
      <div className="regras-header">
        <h2>Diretrizes &amp; Código de Conduta</h2>
        <p>A integridade e o respeito são pilares na TW Network. Conheça as normas vigentes para manter a sua conta em segurança.</p>
      </div>

      <div className="regras-tabs">
        {categorias.map((cat) => {
          const isAtiva = categoriaAtiva === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`tab-regra-btn ${isAtiva ? 'ativa' : ''}`}
              onClick={() => setCategoriaAtiva(cat.id)}
            >
              <McIcon name={cat.mcIcon} size={18} />
              <span>{cat.nome}</span>
            </button>
          );
        })}
      </div>

      <div className="regras-grid">
        {regrasPorCategoria[categoriaAtiva].map((item, index) => (
          <div key={index} className="regra-card">
            <div className="regra-topo">
              <h3 className="regra-titulo">{item.infracao}</h3>
              <span className={`badge-punicao ${item.nivel}`}>
                {item.punicao}
              </span>
            </div>
            <p className="regra-detalhe">{item.detalhe}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
