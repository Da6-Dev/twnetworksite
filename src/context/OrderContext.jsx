import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

const PEDIDOS_PADRAO = [
  {
    id: 'TW-94821',
    nick: 'TeDabliukkkkk',
    pacote: 'VIP Deus Supremo (Vitalício)',
    categoria: 'VIPs',
    mcIcon: 'Nether_Star',
    valor: 'R$ 89,90',
    metodo: 'Pix Instantâneo',
    data: 'Hoje às 14:22',
    status: 'entregue',
    statusTexto: 'Entregue & Ativado',
    codigoAtivacao: 'VIP-DEUS-94821',
    comando: '/ativar VIP-DEUS-94821'
  },
  {
    id: 'TW-88310',
    nick: 'Minerador_Pro',
    pacote: 'Combo 5x Chaves Épicas',
    categoria: 'Chaves & Caixas',
    mcIcon: 'Diamond',
    valor: 'R$ 29,90',
    metodo: 'Pix Instantâneo',
    data: 'Ontem às 19:40',
    status: 'entregue',
    statusTexto: 'Entregue & Ativado',
    codigoAtivacao: 'KEY-EPIC-88310',
    comando: '/correio'
  },
  {
    id: 'TW-77194',
    nick: 'ShadowCrafter',
    pacote: 'Pacote 100.000 Cash',
    categoria: 'Cash',
    mcIcon: 'Gold_Ingot',
    valor: 'R$ 49,90',
    metodo: 'Cartão de Crédito',
    data: '20/10/2026',
    status: 'aguardando_ativacao',
    statusTexto: 'Aguardando Ativação In-Game',
    codigoAtivacao: 'CASH-100K-77194',
    comando: '/ativar CASH-100K-77194'
  },
  {
    id: 'TW-65102',
    nick: 'ValkyriePvP',
    pacote: 'VIP Titã (Mensal)',
    categoria: 'VIPs',
    mcIcon: 'Diamond_Sword',
    valor: 'R$ 34,90',
    metodo: 'Pix Instantâneo',
    data: '18/10/2026',
    status: 'entregue',
    statusTexto: 'Entregue & Ativado',
    codigoAtivacao: 'VIP-TITA-65102',
    comando: '/ativar VIP-TITA-65102'
  }
];

export function OrderProvider({ children }) {
  const [pedidos, setPedidos] = useState(() => {
    try {
      const salvo = localStorage.getItem('tw_pedidos_historico');
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch {
      // Ignora erro de JSON
    }
    return PEDIDOS_PADRAO;
  });

  useEffect(() => {
    try {
      localStorage.setItem('tw_pedidos_historico', JSON.stringify(pedidos));
    } catch {
      // Ignora erro
    }
  }, [pedidos]);

  // Função para adicionar novo pedido vindo do Checkout
  const registrarNovoPedido = ({ nick, itens, _total, metodo }) => {
    const agora = new Date();
    const horaFormatada = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const numId = Math.floor(10000 + Math.random() * 90000);
    const idPedido = `TW-${numId}`;

    const novosItens = itens.map((item, index) => {
      const codigo = `TW-${item.nome.replace(/\s+/g, '-').toUpperCase()}-${numId + index}`;
      return {
        id: `${idPedido}-${index + 1}`,
        idGrupo: idPedido,
        nick: nick.trim(),
        pacote: `${item.nome} ${item.quantidade > 1 ? `(${item.quantidade}x)` : ''}`,
        categoria: item.categoria || 'Loja',
        mcIcon: item.mcIcon || 'Emerald',
        valor: `R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}`,
        metodo: metodo || 'Pix Instantâneo',
        data: `Hoje às ${horaFormatada}`,
        status: 'entregue',
        statusTexto: 'Entregue & Ativado',
        codigoAtivacao: codigo,
        comando: `/ativar ${codigo}`
      };
    });

    setPedidos((prev) => [...novosItens, ...prev]);
    return idPedido;
  };

  const buscarPedidosPorNick = (termo) => {
    if (!termo || !termo.trim()) return [];
    const busca = termo.trim().toLowerCase();
    return pedidos.filter((p) => p.nick.toLowerCase() === busca);
  };

  return (
    <OrderContext.Provider
      value={{
        pedidos,
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
