import React, { useState } from 'react';
import './NewsSection.css';
import McIcon from './McIcon';

export default function NewsSection() {
  const [filtro, setFiltro] = useState('todas');

  const noticias = [
    {
      id: 1,
      categoria: 'atualizacao',
      categoriaNome: 'Atualização',
      mcIcon: 'Anvil',
      data: 'Hoje às 18:30',
      titulo: 'Patch Notes v1.2: Balanceamento da Economia e Minas',
      resumo: 'Ajustamos os multiplicadores de venda nas minas do Rank Ouro e Supremo, além de introduzir novas proteções automáticas para terrenos.',
      autor: 'TeDabliukkkkk'
    },
    {
      id: 2,
      categoria: 'evento',
      categoriaNome: 'Evento',
      mcIcon: 'Golden_Apple',
      data: 'Ontem',
      titulo: 'Torneio Gladiador de Abertura com Premiação via Pix',
      resumo: 'As inscrições para os clãs estão abertas. O clã vencedor deste sábado levará 150 reais no Pix e uma tag comemorativa para todos os membros.',
      autor: 'AdminTW'
    },
    {
      id: 3,
      categoria: 'comunicado',
      categoriaNome: 'Comunicado',
      mcIcon: 'Paper',
      data: 'Há 3 dias',
      titulo: 'Abertura do Sistema de Recompensas Diárias e Sincronização',
      resumo: 'Agora você já pode vincular o seu Nick de Minecraft diretamente no nosso site oficial para resgatar chaves e bônus diários in-game.',
      autor: 'TW Studios'
    }
  ];

  const noticiasFiltradas = filtro === 'todas'
    ? noticias
    : noticias.filter((item) => item.categoria === filtro);

  return (
    <section id="noticias" className="news-section">
      <div className="news-header">
        <span className="badge-secao-news">
          <McIcon name="Paper" size={16} />
          Mural da Comunidade
        </span>
        <h2>Notícias & <span className="highlight">Atualizações</span></h2>
        <p>Acompanhe em primeira mão os comunicados da administração e as notas de versão do servidor.</p>
      </div>

      <div className="news-filtros">
        <button
          className={`filtro-btn ${filtro === 'todas' ? 'ativo' : ''}`}
          onClick={() => setFiltro('todas')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <McIcon name="Book" size={16} />
          Todas
        </button>
        <button
          className={`filtro-btn ${filtro === 'atualizacao' ? 'ativo' : ''}`}
          onClick={() => setFiltro('atualizacao')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <McIcon name="Anvil" size={16} />
          Notas de Versão
        </button>
        <button
          className={`filtro-btn ${filtro === 'evento' ? 'ativo' : ''}`}
          onClick={() => setFiltro('evento')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <McIcon name="Golden_Apple" size={16} />
          Eventos
        </button>
        <button
          className={`filtro-btn ${filtro === 'comunicado' ? 'ativo' : ''}`}
          onClick={() => setFiltro('comunicado')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <McIcon name="Paper" size={16} />
          Comunicados
        </button>
      </div>

      <div className="news-grid">
        {noticiasFiltradas.map((artigo) => (
          <article key={artigo.id} className="news-card">
            <div className="news-card-topo">
              <span className={`news-tag ${artigo.categoria}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <McIcon name={artigo.mcIcon} size={16} />
                {artigo.categoriaNome}
              </span>
              <time className="news-data">{artigo.data}</time>
            </div>

            <h3 className="news-titulo">{artigo.titulo}</h3>
            <p className="news-resumo">{artigo.resumo}</p>

            <div className="news-card-rodape">
              <span className="news-autor">Publicado por <strong>{artigo.autor}</strong></span>
              <span className="news-ler-mais">Ler notícia completa →</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}