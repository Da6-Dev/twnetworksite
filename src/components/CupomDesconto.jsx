import React, { useState } from 'react';
import './CupomDesconto.css';
import McIcon from './McIcon';

export default function CupomDesconto({ onAplicarCupom, cupomAtivo }) {
  const [codigo, setCodigo] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  // Lista de cupons configurados
  const cuponsValidos = {
    TWSTUDIOS: 0.15, // 15% de desconto
    BEMVINDO: 0.10,  // 10% de desconto
    TEDABLIU: 0.20,  // 20% de desconto de abertura
    NATAL20: 0.20    // 20% de desconto natalino
  };

  const aplicarCodigo = (e) => {
    e.preventDefault();
    const codigoFormatado = codigo.trim().toUpperCase();

    if (!codigoFormatado) return;

    if (cuponsValidos[codigoFormatado]) {
      onAplicarCupom({
        codigo: codigoFormatado,
        desconto: cuponsValidos[codigoFormatado]
      });
      setMensagemErro('');
      setCodigo('');
    } else {
      setMensagemErro('Cupom inválido ou expirado.');
    }
  };

  return (
    <div className="cupom-container">
      {!cupomAtivo ? (
        <form onSubmit={aplicarCodigo} className="cupom-form">
          <input
            type="text"
            placeholder="Possui cupom de desconto?"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value);
              setMensagemErro('');
            }}
            className="input-cupom"
          />
          <button type="submit" className="btn-aplicar-cupom">
            <McIcon name="Paper" size={14} />
            Aplicar
          </button>
        </form>
      ) : (
        <div className="cupom-ativo-box">
          <span>
            Cupom <strong>{cupomAtivo.codigo}</strong> aplicado ({cupomAtivo.desconto * 100}% OFF)
          </span>
          <button 
            type="button" 
            className="btn-remover-cupom" 
            onClick={() => onAplicarCupom(null)}
          >
            Remover
          </button>
        </div>
      )}

      {mensagemErro && <p className="cupom-erro">{mensagemErro}</p>}
    </div>
  );
}