import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { usuario, estaLogado, recarregarUsuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [carregandoPedidos, setCarregandoPedidos] = useState(false);

  // Recarregar pedidos reais do PostgreSQL
  const recarregarPedidos = useCallback(async (nickCustom) => {
    const token = localStorage.getItem('tw_auth_token');
    const nickAlvo = nickCustom || usuario?.nick;

    if (!token && !nickAlvo) {
      setPedidos([]);
      return;
    }

    setCarregandoPedidos(true);
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const url = nickAlvo 
        ? `/api/pedidos/historico?nick=${encodeURIComponent(nickAlvo)}`
        : '/api/pedidos/historico';

      const res = await fetch(url, { headers });
      const dados = await res.json();

      if (res.ok && dados.sucesso && Array.isArray(dados.pedidos)) {
        setPedidos(dados.pedidos);
        if (recarregarUsuario) recarregarUsuario();
      } else {
        setPedidos([]);
      }
    } catch (err) {
      console.error('Erro ao buscar pedidos no servidor:', err);
    } finally {
      setCarregandoPedidos(false);
    }
  }, [usuario?.nick]);

  // Sincroniza sempre que o usuário loga ou altera de conta
  useEffect(() => {
    if (estaLogado && usuario) {
      recarregarPedidos(usuario.nick);
    } else {
      setPedidos([]);
    }
  }, [estaLogado, usuario?.nick, recarregarPedidos]);

  // Função para registrar novo pedido com o status real (PENDENTE ou APROVADO)
  const registrarNovoPedido = ({ nick, itens, total, metodo, status, pedidoId, copiaECola, qrCodeBase64 }) => {
    const statusReal = status ? String(status).toLowerCase() : (metodo === 'Cartão de Crédito' ? 'aprovado' : 'pendente');
    
    let statusTexto = 'Aguardando Pagamento';
    if (statusReal === 'aprovado') statusTexto = 'Pagamento Aprovado';
    else if (statusReal === 'entregue') statusTexto = 'Entregue & Ativado';
    else if (statusReal === 'recusado') statusTexto = 'Recusado / Cancelado';

    const idPedido = pedidoId ? `TW-${pedidoId}` : `TW-${Math.floor(10000 + Math.random() * 90000)}`;

    const novoItemOtimista = {
      id: idPedido,
      numeroId: pedidoId || null,
      nick: (nick || usuario?.nick || '').trim(),
      email: usuario?.email || '',
      metodo: metodo || 'Pix Instantâneo',
      metodoTexto: metodo || 'Pix Instantâneo',
      status: statusReal,
      statusTexto,
      valor: `R$ ${Number(total || 0).toFixed(2).replace('.', ',')}`,
      valorNumerico: Number(total || 0),
      data: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      pagoEm: statusReal === 'aprovado' ? 'Agora' : null,
      pacote: Array.isArray(itens) 
        ? itens.map((it) => `${it.nome || 'Item'} ${it.quantidade > 1 ? `(${it.quantidade}x)` : ''}`).join(' + ')
        : 'Pedido na Loja',
      itens: Array.isArray(itens) ? itens : [],
      mcIcon: itens?.[0]?.mcIcon || 'Emerald',
      pixCopiaCola: copiaECola || '',
      pixQrCodeBase64: qrCodeBase64 || '',
      codigoAtivacao: `${idPedido}-${(nick || '').toUpperCase()}`,
      comando: statusReal === 'aprovado' || statusReal === 'entregue' ? `/ativar ${idPedido}-${(nick || '').toUpperCase()}` : null
    };

    setPedidos((prev) => [novoItemOtimista, ...prev.filter(p => p.id !== idPedido)]);

    // Recarrega do banco de dados em background após 1.5s para sincronizar ID do PostgreSQL
    setTimeout(() => {
      recarregarPedidos(nick);
    }, 1500);

    return idPedido;
  };

  const buscarPedidosPorNick = (termo) => {
    if (!termo || !termo.trim()) return pedidos;
    const busca = termo.trim().toLowerCase();
    return pedidos.filter((p) => (p.nick || '').toLowerCase() === busca);
  };

  return (
    <OrderContext.Provider
      value={{
        pedidos,
        carregandoPedidos,
        recarregarPedidos,
        registrarNovoPedido,
        buscarPedidosPorNick
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders deve ser usado dentro de um OrderProvider');
  }
  return context;
}
