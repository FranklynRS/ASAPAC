import React from 'react';
import './CategoriasDetailsModal.scss';

interface CategoriasDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoria: {
    nome_categoria: string;
    descricao: string | null;
    tipo: number;
    created_at: string;
    created_by_user_name: string | null;
  } | null;
}

const CategoriasDetailsModal: React.FC<CategoriasDetailsModalProps> = ({ isOpen, onClose, categoria }) => {
  if (!isOpen || !categoria) return null;

  const formattedDate = categoria.created_at ? new Date(categoria.created_at).toLocaleDateString('pt-BR') : 'Data inválida';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Detalhes da Categoria</h2>
        <div className="details-content">
          <p><strong>Nome da Categoria:</strong> {categoria.nome_categoria}</p>
          <p><strong>Tipo:</strong> {categoria.tipo === 1 ? 'Receita (Saldo Positivo)' : 'Gasto (Saldo Negativo)'}</p>
          {categoria.descricao && <p><strong>Descrição:</strong> {categoria.descricao}</p>}
          <p><strong>Criada em:</strong> {formattedDate}</p>
          <p><strong>Criada por:</strong> {categoria.created_by_user_name || 'Usuário não informado'}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoriasDetailsModal;