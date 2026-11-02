import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { SoundProvider } from './context/SoundContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';
import { useCart } from './context/useCart';
import Snowfall from './components/Snowfall';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Toast from './components/Toast';

// Páginas com rotas dedicadas
import HomePage from './pages/HomePage';
import LojaPage from './pages/LojaPage';
import AtividadesPage from './pages/AtividadesPage';
import GuiaPage from './pages/GuiaPage';
import CarrinhoPage from './pages/CarrinhoPage';
import CheckoutPage from './pages/CheckoutPage';
import ConclusaoPage from './pages/ConclusaoPage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import PerfilPage from './pages/PerfilPage';

// Utilitário para reposicionar a janela no topo a cada transição de rota
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout interno que consome o contexto de notificações do carrinho
function AppLayout() {
  const { toastInfo, setToastInfo } = useCart();

  return (
    <div className="App">
      <ScrollToTop />
      <Snowfall />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/atividades" element={<AtividadesPage />} />
          <Route path="/hub" element={<Navigate to="/atividades" replace />} />
          <Route path="/guia" element={<GuiaPage />} />
          <Route path="/comandos" element={<Navigate to="/guia" replace />} />
          <Route path="/regras" element={<Navigate to="/guia" replace />} />
          <Route path="/suporte" element={<Navigate to="/guia" replace />} />
          <Route path="/equipe" element={<Navigate to="/guia" replace />} />
          <Route path="/loja" element={<LojaPage />} />
          <Route path="/carrinho" element={<CarrinhoPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/conclusao" element={<ConclusaoPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/conta" element={<Navigate to="/perfil" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <BackToTop />

      {/* Alerta flutuante de feedback */}
      {toastInfo && (
        <Toast
          mensagem={toastInfo.mensagem}
          tipo={toastInfo.tipo}
          onClose={() => setToastInfo(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SoundProvider>
          <AuthProvider>
            <OrderProvider>
              <CartProvider>
                <AppLayout />
              </CartProvider>
            </OrderProvider>
          </AuthProvider>
        </SoundProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;