import React from 'react';
import Modal from 'react-modal';
import './MensageirosDetailsModal.scss';
import { Mensageiro } from '../services/mensageirosService';

interface MensageiroDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mensageiro: Mensageiro | null;
}

Modal.setAppElement('#root');

const MensageiroDetailsModal: React.FC<MensageiroDetailsModalProps> = ({ isOpen, onClose, mensageiro }) => {
  if (!isOpen || !mensageiro) return null;

  const statusText = mensageiro.status ? 'Ativo' : 'Inativo';
  const formattedCreatedAt = mensageiro.created_at ? new Date(mensageiro.created_at).toLocaleString('pt-BR') : 'Data inválida';

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Detalhes do Mensageiro"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <button className="modal-close-btn" onClick={onClose}>&times;</button>
      <h2 className="modal-title">Detalhes do Mensageiro</h2>
      <div className="details-content">
        <p><strong>Código:</strong> {mensageiro.codigo_mensageiro}</p>
        <p><strong>Nome:</strong> {mensageiro.nome_mensageiro}</p>
        <p><strong>Telefone:</strong> {mensageiro.telefone}</p>
        <p><strong>Status:</strong> {statusText}</p>
        <p><strong>Criado em:</strong> {formattedCreatedAt}</p>
      </div>
      <div className="modal-actions">
        <button onClick={onClose} className="btn-close">Fechar</button>
      </div>
    </Modal>
  );
};

export default MensageiroDetailsModal;