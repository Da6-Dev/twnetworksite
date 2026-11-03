import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import McIcon from './McIcon';
import './NewsSection.css';

export default function NewsSection() {
  const [filtro, setFiltro] = useState('todas');

  const noticias = [
    {
      id: 1,
      categoria: 'atualizacao',
      categoriaNome: 'Notas de Versão',
      mcIcon: 'Anvil',
      data: 'Hoje às 18:30',
      titulo: 'Patch Notes v1.2: Balanceamento da Economia e Minas',
      resumo: 'Ajustamos os multiplicadores de venda nas minas do Rank Ouro e Supremo, além de introduzir novas proteções automáticas para terrenos.',
      autor: 'TeDabliukkkkk'
    },
    {
      id: 2,
      categoria: 'evento',
      categoriaNome: 'Evento Especial',
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

  const filtros = [
    { id: 'todas', nome: 'Todas' },
    { id: 'atualizacao', nome: 'Notas de Versão' },
    { id: 'evento', nome: 'Eventos' },
    { id: 'comunicado', nome: 'Comunicados' }
  ];

  const noticiasFiltradas = filtro === 'todas'
    ? noticias
    : noticias.filter((item) => item.categoria === filtro);

  return (
    <section id="noticias" className="news-section">
      <div className="news-header">
        <h2>Atualizações &amp; Mural Oficial</h2>
        <p>Acompanhe em primeira mão os comunicados da administração, notas de versão e eventos sazonais.</p>
      </div>

      <div className="news-filtros">
        {filtros.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filtro-btn ${filtro === f.id ? 'ativo' : ''}`}
            onClick={() => setFiltro(f.id)}
          >
            {f.nome}
          </button>
        ))}
      </div>

      <div className="news-grid">
        {noticiasFiltradas.map((artigo) => (
          <article key={artigo.id} className="news-card">
            <div className="news-card-topo">
              <span className={`news-tag ${artigo.categoria}`}>
                <McIcon name={artigo.mcIcon} size={15} />
                <span>{artigo.categoriaNome}</span>
              </span>
              <time className="news-data">
                <Calendar size={13} />
                <span>{artigo.data}</span>
              </time>
            </div>

            <h3 className="news-titulo">{artigo.titulo}</h3>
            <p className="news-resumo">{artigo.resumo}</p>

            <div className="news-card-rodape">
              <span className="news-autor">Por <strong>{artigo.autor}</strong></span>
              <span className="news-ler-mais">
                <span>Ler nota</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
