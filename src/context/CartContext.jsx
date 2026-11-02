import React, { useState, useEffect } from 'react';
import { CartContext } from './CartContextInstance';

export function CartProvider({ children }) {
  // Inicialização do carrinho a partir da cache local
  const [carrinho, setCarrinho] = useState(() => {
    try {
      const salvo = localStorage.getItem('twnetwork_carrinho');
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  });

  const [cupomAtivo, setCupomAtivo] = useState(() => {
    try {
      const salvo = localStorage.getItem('twnetwork_cupom');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  const [ultimoPedido, setUltimoPedido] = useState(() => {
    try {
      const salvo = localStorage.getItem('twnetwork_ultimo_pedido');
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  });

  const [toastInfo, setToastInfo] = useState(null);

  // Sincronização automática com localStorage
  useEffect(() => {
    localStorage.setItem('twnetwork_carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  useEffect(() => {
    if (cupomAtivo) {
      localStorage.setItem('twnetwork_cupom', JSON.stringify(cupomAtivo));
    } else {
      localStorage.removeItem('twnetwork_cupom');
    }
  }, [cupomAtivo]);

  useEffect(() => {
    if (ultimoPedido) {
      localStorage.setItem('twnetwork_ultimo_pedido', JSON.stringify(ultimoPedido));
    }
  }, [ultimoPedido]);

  const exibirNotificacao = (mensagem, tipo = 'sucesso') => {
    setToastInfo({ mensagem, tipo });
  };

  const parsePreco = (precoStr) => {
    if (typeof precoStr === 'number') return precoStr;
    const limpo = precoStr.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(limpo) || 0;
  };

  const adicionarAoCarrinho = (item) => {
    setCarrinho((prev) => {
      // Verifica se o item já existe para aumentar a quantidade
      const indiceExistente = prev.findIndex((i) => i.id === item.id);
      if (indiceExistente > -1) {
        const novo = [...prev];
        novo[indiceExistente] = {
          ...novo[indiceExistente],
          quantidade: (novo[indiceExistente].quantidade || 1) + 1
        };
        return novo;
      }
      return [...prev, { ...item, quantidade: 1, valorNumerico: parsePreco(item.preco) }];
    });
    exibirNotificacao(`"${item.nome}" foi adicionado ao carrinho!`, 'sucesso');
  };

  const atualizarQuantidade = (id, delta) => {
    setCarrinho((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const novaQtd = (item.quantidade || 1) + delta;
            return novaQtd > 0 ? { ...item, quantidade: novaQtd } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removerDoCarrinho = (idOuIndice) => {
    setCarrinho((prev) => {
      if (typeof idOuIndice === 'number' && idOuIndice < prev.length && !prev.some(i => i.id === idOuIndice)) {
        return prev.filter((_, idx) => idx !== idOuIndice);
      }
      return prev.filter((item, idx) => item.id !== idOuIndice && idx !== idOuIndice);
    });
    exibirNotificacao('Item removido do carrinho.', 'info');
  };

  const limparCarrinho = () => {
    setCarrinho([]);
    setCupomAtivo(null);
    localStorage.removeItem('twnetwork_carrinho');
    localStorage.removeItem('twnetwork_cupom');
  };

  // Cálculos financeiros
  const subtotal = carrinho.reduce((acc, item) => {
    const unitario = item.valorNumerico || parsePreco(item.preco);
    const qtd = item.quantidade || 1;
    return acc + unitario * qtd;
  }, 0);

  const descontoValor = cupomAtivo ? subtotal * cupomAtivo.desconto : 0;
  const totalFinal = Math.max(0, subtotal - descontoValor);
  const totalItens = carrinho.reduce((acc, item) => acc + (item.quantidade || 1), 0);

  const concluirPedido = (dadosPedido) => {
    const pedidoCompleto = {
      ...dadosPedido,
      id: `TW-${Math.floor(100000 + Math.random() * 900000)}`,
      data: new Date().toLocaleString('pt-BR'),
      itens: [...carrinho],
      subtotal,
      descontoValor,
      totalFinal,
      cupom: cupomAtivo ? cupomAtivo.codigo : null
    };
    setUltimoPedido(pedidoCompleto);
    limparCarrinho();
    return pedidoCompleto;
  };

  return (
    <CartContext.Provider
      value={{
        carrinho,
        totalItens,
        subtotal,
        descontoValor,
        totalFinal,
        cupomAtivo,
        setCupomAtivo,
        adicionarAoCarrinho,
        atualizarQuantidade,
        removerDoCarrinho,
        limparCarrinho,
        concluirPedido,
        ultimoPedido,
        toastInfo,
        setToastInfo,
        exibirNotificacao
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
