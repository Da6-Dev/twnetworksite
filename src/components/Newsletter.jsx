import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, Video } from 'lucide-react';
import { toast } from 'sonner';
import { useSound } from '../context/SoundContext';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [inscrito, setInscrito] = useState(false);
  const [erroEmail, setErroEmail] = useState('');
  const { tocarSucesso } = useSound();

  const lidarInscricao = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErroEmail('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    setErroEmail('');
    setInscrito(true);
    tocarSucesso();
    toast.success('Inscrição confirmada! Você receberá códigos e novidades no seu e-mail.');
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-card">
        <div className="newsletter-content">
          <h2>Novidades da Temporada &amp; Cupons</h2>
          <p>
            Cadastre seu e-mail para receber notificações de reinício de temporada, avisos de torneios com Pix e cupons de desconto relâmpago para a nossa loja.
          </p>

          {!inscrito ? (
            <div>
              <form onSubmit={lidarInscricao} className="newsletter-form">
                <div className="newsletter-input-wrapper">
                  <Mail size={18} className="newsletter-icon" />
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
                </div>
                <button type="submit" className="btn-inscrever">
                  <Send size={16} />
                  <span>Inscrever-se</span>
                </button>
              </form>
              {erroEmail && <p className="newsletter-erro-msg">{erroEmail}</p>}
            </div>
          ) : (
            <div className="newsletter-sucesso">
              <CheckCircle2 size={36} className="text-emerald-400" />
              <strong>Inscrição Confirmada com Sucesso!</strong>
              <p>Obrigado por se juntar à comunidade TW Network. Fique de olho na sua caixa de entrada.</p>
            </div>
          )}

          <div className="newsletter-comunidade">
            <span>Prefere novidades e suporte em tempo real?</span>
            <div className="comunidade-botoes">
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="btn-social discord">
                <MessageSquare size={16} />
                <span>Discord Oficial</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="btn-social youtube">
                <Video size={16} />
                <span>YouTube Oficial</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
