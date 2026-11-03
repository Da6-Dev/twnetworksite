import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sparkles, BookOpen, Radio, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import McIcon from './McIcon';
import './Navbar.css';

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { totalItens } = useCart();
  const { usuario, estaLogado } = useAuth();
  const { tocarClique } = useSound();
  const location = useLocation();

  const alternarMenu = () => setMenuAberto(!menuAberto);
  const fecharMenu = () => setMenuAberto(false);

  return (
    <nav className="navbar" id="inicio">
      <div className="navbar-logo">
        <Link to="/" onClick={fecharMenu} className="logo-link">
          <McIcon name="Grass_Block" size={24} />
          <h2><span className="destaque-logo">TW</span> Network</h2>
        </Link>
      </div>

      {/* Botão Hambúrguer moderno com Lucide */}
      <button 
        type="button"
        className="btn-hamburger" 
        onClick={alternarMenu}
        aria-label={menuAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
      >
        {menuAberto ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Links de navegação */}
      <ul className={`navbar-links ${menuAberto ? 'ativo' : ''}`}>
        <li>
          <Link 
            to="/" 
            onClick={() => {
              tocarClique();
              fecharMenu();
            }} 
            className={location.pathname === '/' ? 'link-ativo' : ''}
          >
            Início
          </Link>
        </li>
        <li>
          <Link 
            to="/atividades" 
            onClick={() => {
              tocarClique();
              fecharMenu();
            }}
            className={`nav-link-flex ${location.pathname === '/atividades' ? 'link-ativo' : ''}`}
          >
            <Radio size={16} />
            <span>Atividades</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/loja" 
            className={`nav-link-flex destaque ${location.pathname === '/loja' ? 'link-ativo' : ''}`} 
            onClick={() => {
              tocarClique();
              fecharMenu();
            }}
          >
            <Sparkles size={16} />
            <span>Loja VIP</span>
          </Link>
        </li>
        <li>
          <Link 
            to="/guia" 
            onClick={() => {
              tocarClique();
              fecharMenu();
            }}
            className={`nav-link-flex ${location.pathname === '/guia' ? 'link-ativo' : ''}`}
          >
            <BookOpen size={16} />
            <span>Guia &amp; Suporte</span>
          </Link>
        </li>

        {/* Carrinho de Compras */}
        <li className="nav-item-carrinho">
          <Link 
            to="/carrinho" 
            className="btn-carrinho-nav" 
            onClick={() => {
              tocarClique();
              fecharMenu();
            }}
          >
            <ShoppingBag size={18} />
            <span>Carrinho</span>
            {totalItens > 0 && <span className="badge-carrinho">{totalItens}</span>}
          </Link>
        </li>

        {/* Área de Autenticação / Perfil */}
        <li className="nav-item-auth">
          {estaLogado && usuario ? (
            <Link
              to="/perfil"
              className={`nav-user-chip ${location.pathname === '/perfil' ? 'ativo' : ''}`}
              onClick={() => {
                tocarClique();
                fecharMenu();
              }}
              title="Meu Perfil, Pedidos e Configurações"
            >
              <img
                src={`https://mc-heads.net/avatar/${usuario.nick}/24`}
                alt={usuario.nick}
                className="nav-avatar-img"
              />
              <span className="nav-user-nick">{usuario.nick}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className={`btn-entrar-nav ${location.pathname === '/login' || location.pathname === '/cadastro' ? 'ativo' : ''}`}
              onClick={() => {
                tocarClique();
                fecharMenu();
              }}
            >
              <User size={16} />
              <span>Entrar</span>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
