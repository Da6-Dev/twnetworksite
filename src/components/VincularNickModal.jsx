import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import McIcon from './McIcon';
import './VincularNickModal.css';

export default function VincularNickModal() {
  const { usuario, modalVincularAberto, fecharModalVincular, vincularNickMinecraft } = useAuth();
  const { tocarClique, tocarSucesso } = useSound();

  const [novoNick, setNovoNick] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (modalVincularAberto && usuario) {
      setNovoNick(usuario.nickVinculado ? usuario.nick : '');
      setErro('');
      setSucesso('');
      setSalvando(false);
    }
  }, [modalVincularAberto, usuario]);

  // Listener para fechar no Escape
  useEffect(() => {
    if (!modalVincularAberto) return;
    const lidarTecla = (e) => {
      if (e.key === 'Escape') fecharModalVincular();
    };
    window.addEventListener('keydown', lidarTecla);
    return () => window.removeEventListener('keydown', lidarTecla);
  }, [modalVincularAberto, fecharModalVincular]);

  if (!modalVincularAberto || !usuario) return null;

  const handleSalvar = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    const limpo = novoNick.trim();
    if (!limpo) {
      setErro('Informe o seu Nick do Minecraft.');
      return;
    }
    if (limpo.length < 3 || limpo.length > 16) {
      setErro('O Nick do Minecraft deve ter entre 3 e 16 caracteres.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(limpo)) {
      setErro('O Nick só pode conter letras, números e underline (_).');
      return;
    }

    setSalvando(true);
    tocarClique();

    const res = await vincularNickMinecraft(limpo);
    setSalvando(false);

    if (res.sucesso) {
      tocarSucesso();
      toast.success(`Nick atualizado para "${res.usuario.nick}" com sucesso!`);
      setSucesso(`Nick atualizado para "${res.usuario.nick}" com sucesso!`);
      setTimeout(() => {
        fecharModalVincular();
      }, 1200);
    } else {
      setErro(res.mensagem || 'Falha ao vincular seu Nick.');
    }
  };

  const nickPreview = novoNick.trim() || 'Steve';

  return (
    <div className="vincular-nick-overlay" onClick={fecharModalVincular}>
      <motion.div 
        className="vincular-nick-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vincular-modal-titulo"
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <button 
          type="button"
          className="vincular-modal-fechar" 
          onClick={() => {
            tocarClique();
            fecharModalVincular();
          }}
          title="Fechar"
        >
          <X size={18} />
        </button>

        <div className="vincular-modal-header">
          <div className="vincular-modal-icon-badge">
            <McIcon name="Name_Tag" size={32} />
          </div>
          <h2 id="vincular-modal-titulo">Vincular Nick do Minecraft</h2>
          <p className="vincular-modal-subtitulo">
            {usuario.nickVinculado ? (
              'Altere o seu Nickname para onde suas compras e entregas automáticas serão enviadas.'
            ) : (
              'Você entrou com a sua Conta Google! Para que seus VIPs, Cash e Caixas cheguem no seu inventário, informe seu Nickname do Minecraft.'
            )}
          </p>
        </div>

        <form onSubmit={handleSalvar} className="vincular-modal-corpo">
          {/* Preview da Skin */}
          <div className="vincular-skin-preview-box">
            <div className="vincular-skin-avatar-wrapper">
              <img 
                src={`https://mc-heads.net/avatar/${nickPreview}/80`} 
                alt={nickPreview}
                className="vincular-skin-avatar-img"
                onError={(e) => {
                  e.currentTarget.src = 'https://mc-heads.net/avatar/steve/80';
                }}
              />
            </div>
            <div className="vincular-skin-info">
              <span className="vincular-preview-rotulo">Preview da Conta Minecraft:</span>
              <strong className="vincular-preview-nick">{novoNick.trim() || 'Aguardando Nick...'}</strong>
              <span className="vincular-preview-tag">
                ● Suporta Original &amp; Pirata
              </span>
            </div>
          </div>

          {/* Campo de Digitação */}
          <div className="vincular-campo-grupo">
            <label htmlFor="input-novo-nick">
              Nickname Exato no Jogo:
            </label>
            <div className="vincular-input-wrapper">
              <input
                id="input-novo-nick"
                type="text"
                maxLength={16}
                placeholder="Ex: TeDabliukkkkk"
                value={novoNick}
                onChange={(e) => {
                  setNovoNick(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''));
                  setErro('');
                }}
                disabled={salvando}
                autoFocus
                required
              />
              <span className="vincular-contador-chars">{novoNick.length}/16</span>
            </div>
            <small className="vincular-ajuda-texto">
              Apenas letras, números e sublinhados (_). Sem espaços ou caracteres especiais.
            </small>
          </div>

          {/* Mensagens de Erro ou Sucesso */}
          {erro && (
            <div className="vincular-mensagem-alerta erro">
              <AlertCircle size={16} />
              <span>{erro}</span>
            </div>
          )}

          {sucesso && (
            <div className="vincular-mensagem-alerta sucesso">
              <Check size={16} />
              <span>{sucesso}</span>
            </div>
          )}

          {/* Ações */}
          <div className="vincular-modal-acoes">
            <button
              type="button"
              className="vincular-btn-cancelar"
              onClick={() => {
                tocarClique();
                fecharModalVincular();
              }}
              disabled={salvando}
            >
              Lembrar Mais Tarde
            </button>

            <button
              type="submit"
              className="vincular-btn-confirmar"
              disabled={salvando || !novoNick.trim()}
            >
              {salvando ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Salvar Nickname</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
