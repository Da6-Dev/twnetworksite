import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import './Navbar.css';
import McIcon from './McIcon';

export default function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { totalItens } = useCart();
  const { usuario, estaLogado } = useAuth();
  const { tocarClique } = useSound();
  const location = useLocation();

  const alternarMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <nav className="navbar" id="inicio">
      <div className="navbar-logo">
        <Link to="/" onClick={fecharMenu} style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
          <McIcon name="Grass_Block" size={24} style={{ marginRight: '8px' }} />
          <h2><span className="destaque-logo">TW</span> Network</h2>
        </Link>
      </div>

      {/* Botão Hambúrguer para telas móveis */}
      <button 
        className={`btn-hamburger ${menuAberto ? 'aberto' : ''}`} 
        onClick={alternarMenu}
        aria-label="Abrir menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Lista de navegação */}
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
            className={location.pathname === '/atividades' ? 'link-ativo' : ''}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <McIcon name="Beacon" size={15} />
            Atividades
          </Link>
        </li>
        <li>
          <Link 
            to="/loja" 
            className={`destaque ${location.pathname === '/loja' ? 'link-ativo' : ''}`} 
            onClick={() => {
              tocarClique();
              fecharMenu();
            }} 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <McIcon name="Emerald" size={16} />
            Loja VIP
          </Link>
        </li>
        <li>
          <Link 
            to="/guia" 
            onClick={() => {
              tocarClique();
              fecharMenu();
            }}
            className={location.pathname === '/guia' ? 'link-ativo' : ''}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <McIcon name="Book" size={15} />
            Guia & Suporte
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
            style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <McIcon name="Chest" size={18} style={{ marginRight: '6px' }} />
            Carrinho {totalItens > 0 && <span className="badge-carrinho">{totalItens}</span>}
          </Link>
        </li>

        {/* Área de Autenticação / Perfil do Jogador */}
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
              <McIcon name="Nether_Star" size={16} />
              <span>Entrar</span>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}