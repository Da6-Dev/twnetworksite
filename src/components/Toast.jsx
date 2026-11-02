import React, { useEffect } from 'react';
import './Toast.css';
import McIcon from './McIcon';

export default function Toast({ mensagem, tipo = 'sucesso', onClose }) {
  useEffect(() => {
    const temporizador = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(temporizador);
  }, [onClose]);

  return (
    <div className={`toast-container toast-${tipo}`}>
      <span className="toast-icone" style={{ display: 'inline-flex', alignItems: 'center' }}>
        {tipo === 'sucesso' && <McIcon name="Emerald" size={20} />}
        {tipo === 'aviso' && <McIcon name="Gold_Ingot" size={20} />}
        {tipo === 'info' && <McIcon name="Diamond" size={20} />}
      </span>
      <span className="toast-mensagem">{mensagem}</span>
      <button className="toast-fechar" onClick={onClose}>×</button>
    </div>
  );
}