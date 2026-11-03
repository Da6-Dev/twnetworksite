import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import McIcon from './McIcon';
import './FaqSection.css';

export default function FaqSection() {
  const [perguntaAberta, setPerguntaAberta] = useState(1);

  const faqs = [
    {
      id: 1,
      mcIcon: 'Clock',
      pergunta: 'Quanto tempo demora para receber meu VIP ou Cash após a compra?',
      resposta: 'Os pagamentos via Pix contam com aprovação instantânea pelo Banco Central e os benefícios são ativados na sua conta do jogo em menos de 1 minuto por entrega automatizada. Para pagamentos em Cartão de Crédito, a liberação ocorre imediatamente após a confirmação pela operadora (geralmente de 1 a 3 minutos).'
    },
    {
      id: 2,
      mcIcon: 'Gold_Ingot',
      pergunta: 'Como funcionam os pagamentos dos prêmios em dinheiro real (Pix)?',
      resposta: 'No encerramento de cada temporada (todos os domingos às 23h59), nossa equipe valida o ranking oficial dos primeiros colocados no RankUP e no Top Mineração. Entramos em contato com os vencedores no Discord e efetuamos a transferência bancária direta via chave Pix em até 24 horas.'
    },
    {
      id: 3,
      mcIcon: 'Compass',
      pergunta: 'Quais versões do Minecraft são compatíveis com a TW Network?',
      resposta: 'O servidor aceita conexões desde a versão 1.8 até a versão 1.20+ mais recente. No entanto, para o RankUP competitivo e combates de alta performance, recomendamos utilizar a versão 1.8.9 ou 1.20 com Lunar Client, Badlion ou OptiFine para obter a máxima taxa de FPS.'
    },
    {
      id: 4,
      mcIcon: 'Book',
      pergunta: 'Comprei para o Nick errado por engano. O que devo fazer?',
      resposta: 'Não se preocupe! Basta abrir um ticket no nosso Discord Oficial com o comprovante do pagamento e informar o Nick correto antes dos itens serem resgatados no jogo. Nossa equipe de suporte realiza a transferência manual da licença para você.'
    },
    {
      id: 5,
      mcIcon: 'Emerald',
      pergunta: 'O servidor aceita contas originais e não-originais (piratas)?',
      resposta: 'Sim! A TW Network possui sistema de autenticação híbrida inteligente. Usuários de Minecraft original contam com auto-login seguro via Mojang/Microsoft, enquanto jogadores com clientes não-originais utilizam o comando /register e /login com criptografia de senha.'
    },
    {
      id: 6,
      mcIcon: 'Redstone',
      pergunta: 'Como ativo os benefícios de um cupom ou pacote no jogo?',
      resposta: 'Após a confirmação de pagamento na nossa loja, você recebe um código único de ativação. Dentro do servidor, basta digitar o comando /ativar <código> ou aguardar o despacho automático no seu correio in-game (/correio).'
    }
  ];

  const alternarPergunta = (id) => {
    setPerguntaAberta(perguntaAberta === id ? null : id);
  };

  return (
    <section id="suporte" className="faq-section">
      <div className="faq-header">
        <h2>Perguntas Frequentes &amp; Prazos</h2>
        <p>Tire suas dúvidas sobre métodos de pagamento, regras da temporada e entrega automática de VIPs.</p>
      </div>

      <div className="faq-lista">
        {faqs.map((faq) => {
          const isAberta = perguntaAberta === faq.id;
          return (
            <div 
              key={faq.id} 
              className={`faq-item ${isAberta ? 'aberto' : ''}`}
            >
              <button
                type="button"
                className="faq-pergunta-btn"
                onClick={() => alternarPergunta(faq.id)}
                aria-expanded={isAberta}
              >
                <div className="faq-titulo-box">
                  <div className="faq-icon-circulo">
                    <McIcon name={faq.mcIcon} size={20} />
                  </div>
                  <h3>{faq.pergunta}</h3>
                </div>
                <div className={`faq-chevron ${isAberta ? 'girado' : ''}`}>
                  <ChevronDown size={20} />
                </div>
              </button>
              
              <AnimatePresence initial={false}>
                {isAberta && (
                  <motion.div
                    key="conteudo"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="faq-resposta">
                      <p>{faq.resposta}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
