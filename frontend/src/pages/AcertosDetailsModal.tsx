import React from 'react';
import './AcertosDetailsModal.scss';
import { Acerto } from '../services/acertosService';

interface AcertosDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  acerto: Acerto | null;
}

const AcertosDetailsModal: React.FC<AcertosDetailsModalProps> = ({ isOpen, onClose, acerto }) => {
  if (!isOpen || !acerto) {
    return null;
  }

  return (
    <div className="details-modal-overlay">
      <div className="details-modal-content">
        <button className="details-modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="details-modal-title">Detalhes do Acerto</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <strong>Nome:</strong>
            <span>{acerto.nome_mensageiro}</span>
          </div>
          <div className="detail-item">
            <strong>Recebimento:</strong>
            <span>R$ {Number(acerto.valor_recebido).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="detail-item">
            <strong>Pagamento:</strong>
            <span>R$ {Number(acerto.pagamento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="detail-item">
            <strong>Gasolina:</strong>
            <span>R$ {Number(acerto.gasolina).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="detail-item">
            <strong>Hotel:</strong>
            <span>R$ {Number(acerto.hotel).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="detail-item">
            <strong>Alimentação:</strong>
            <span>R$ {Number(acerto.alimentacao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="detail-item">
            <strong>Outros:</strong>
            <span>R$ {Number(acerto.outros).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcertosDetailsModal;