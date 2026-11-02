import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import McIcon from './McIcon';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <McIcon name="Grass_Block" size={24} />
            <h3><span className="destaque-logo">TW</span> Network</h3>
          </div>
          <p>O servidor definitivo de RankUP com economia competitiva, minijogos e premiações reais em Pix.</p>
          <span className="footer-ip">
            IP de Conexão: <code>TWNetwork.com.br</code>
          </span>
        </div>

        <div className="footer-links-group">
          <div className="footer-col">
            <h4>Navegação</h4>
            <ul>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/atividades">Hub de Atividades & Pix</Link></li>
              <li><Link to="/loja">Loja Oficial & VIPs</Link></li>
              <li><Link to="/guia">Guia do Servidor</Link></li>
              <li><Link to="/perfil">Meu Perfil & Configurações</Link></li>
              <li><Link to="/carrinho">Meu Carrinho</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Manual & Comunidade</h4>
            <ul>
              <li><Link to="/guia">Comandos In-Game</Link></li>
              <li><Link to="/guia">Diretrizes & Regras</Link></li>
              <li><Link to="/guia">Suporte & FAQ</Link></li>
              <li><Link to="/guia">Equipe & Recrutamento</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>© 2026 TW Network — Desenvolvido por <strong>TW Studios</strong> (TeDabliukkkkk).</p>
        <p className="disclaimer">
          Não somos afiliados, associados ou aprovados pela Mojang Studios ou Microsoft.
        </p>
      </div>
    </footer>
  );
}