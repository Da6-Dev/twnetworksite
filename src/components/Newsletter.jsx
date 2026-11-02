import React, { useState } from 'react';
import './Newsletter.css';
import McIcon from './McIcon';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [inscrito, setInscrito] = useState(false);
  const [erroEmail, setErroEmail] = useState('');

  const lidarInscricao = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErroEmail('Por favor, digite um e-mail válido!');
      return;
    }

    setErroEmail('');
    setInscrito(true);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-card">
        <div className="newsletter-content">
          <div className="newsletter-tag">
            <McIcon name="Enchanted_Book" size={16} />
            <span>Fique por Dentro</span>
          </div>
          
          <h2>Receba Novidades & <span className="highlight">Cupons Exclusivos</span></h2>
          <p>
            Inscreva-se na newsletter oficial da TW Network para receber notificações de reinício de temporada, novidades do RankUP e cupons de desconto relâmpago para a nossa loja de VIPs.
          </p>

          {!inscrito ? (
            <div>
              <form onSubmit={lidarInscricao} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Digite seu melhor e-mail..."
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (erroEmail) setErroEmail('');
                  }}
                  required
                />
                <button type="submit" className="btn-inscrever">
                  <McIcon name="Emerald" size={18} />
                  Inscrever-se
                </button>
              </form>
              {erroEmail && <p className="newsletter-erro-msg">{erroEmail}</p>}
            </div>
          ) : (
            <div className="newsletter-sucesso">
              <div className="newsletter-sucesso-icone">
                <McIcon name="Emerald" size={32} />
              </div>
              <strong>Inscrição Confirmada com Sucesso!</strong>
              <p>Obrigado por se juntar à TW Network. Fique de olho na sua caixa de entrada para resgatar seus códigos e novidades.</p>
            </div>
          )}

          <div className="newsletter-comunidade">
            <span>Prefere novidades e suporte em tempo real?</span>
            <div className="comunidade-botoes">
              <a href="#discord" className="btn-social discord">
                Discord Oficial
              </a>
              <a href="#youtube" className="btn-social youtube">
                Canal Oficial
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}