import React, { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSound } from '../context/SoundContext';
import McIcon from './McIcon';
import './CupomDesconto.css';

export default function CupomDesconto({ onAplicarCupom, cupomAtivo }) {
  const [codigo, setCodigo] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [validando, setValidando] = useState(false);
  const { tocarXP, tocarClique } = useSound();

  const aplicarCodigo = async (e) => {
    e.preventDefault();
    const codigoFormatado = codigo.trim().toUpperCase();
    if (!codigoFormatado) return;

    setValidando(true);
    setMensagemErro('');

    try {
      const res = await fetch('/api/cupons/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: codigoFormatado })
      });

      const dados = await res.json();
      if (res.ok && dados.sucesso && dados.cupom) {
        tocarXP();
        onAplicarCupom({
          codigo: dados.cupom.codigo,
          desconto: dados.cupom.desconto,
          descontoPercentual: dados.cupom.descontoPercentual
        });
        toast.success(`Cupom ${dados.cupom.codigo} aplicado com sucesso!`);
        setMensagemErro('');
        setCodigo('');
      } else {
        setMensagemErro(dados.mensagem || 'Cupom inválido ou expirado.');
      }
    } catch {
      setMensagemErro('Erro ao validar o cupom. Tente novamente.');
    } finally {
      setValidando(false);
    }
  };

  return (
    <div className="cupom-container">
      {!cupomAtivo ? (
        <form onSubmit={aplicarCodigo} className="cupom-form">
          <div className="cupom-input-box">
            <McIcon name="Name_Tag" size={18} className="cupom-input-icon" />
            <input
              type="text"
              placeholder="Cupom de desconto (Ex: NATAL20)"
              value={codigo}
              onChange={(e) => {
                setCodigo(e.target.value.toUpperCase());
                if (mensagemErro) setMensagemErro('');
              }}
              className="input-cupom"
              disabled={validando}
            />
          </div>
          <button type="submit" className="btn-aplicar-cupom" disabled={validando || !codigo.trim()}>
            {validando ? <Loader2 size={16} className="animate-spin" /> : <span>Aplicar</span>}
          </button>
        </form>
      ) : (
        <div className="cupom-ativo-box">
          <div className="cupom-ativo-info">
            <Check size={16} className="text-emerald-400" />
            <span>
              Cupom <strong>{cupomAtivo.codigo}</strong> ativo ({Math.round(cupomAtivo.desconto * 100)}% OFF)
            </span>
          </div>
          <button 
            type="button" 
            className="btn-remover-cupom" 
            onClick={() => {
              tocarClique();
              onAplicarCupom(null);
              toast.info('Cupom removido.');
            }}
            title="Remover cupom"
          >
            <X size={15} />
            <span>Remover</span>
          </button>
        </div>
      )}

      {mensagemErro && <p className="cupom-erro">{mensagemErro}</p>}
    </div>
  );
}
