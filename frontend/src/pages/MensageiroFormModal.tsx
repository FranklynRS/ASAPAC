import React, { useState, useEffect } from 'react';
import './MensageiroFormModal.scss';
import { MensageirosService, Mensageiro } from '../services/mensageirosService';

interface MensageiroFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMensageiroSaved: () => void;
  mensageiroToEdit?: Mensageiro | null;
}

const MensageiroFormModal: React.FC<MensageiroFormModalProps> = ({ isOpen, onClose, onMensageiroSaved, mensageiroToEdit }) => {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mensageiroToEdit) {
      setNome(mensageiroToEdit.nome_mensageiro);
      setCodigo(mensageiroToEdit.codigo_mensageiro);
      setTelefone(mensageiroToEdit.telefone);
    } else {
      setNome('');
      setCodigo('');
      setTelefone('');
    }
  }, [mensageiroToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const mensageiroData = {
      nome_mensageiro: nome,
      codigo_mensageiro: codigo,
      telefone: telefone,
    };

    try {
      if (mensageiroToEdit) {
        await MensageirosService.updateMensageiro(mensageiroToEdit.id_mensageiro, mensageiroData);
      } else {
        await MensageirosService.createMensageiro(mensageiroData);
      }
      onMensageiroSaved();
      onClose();
    } catch (err) {
      setError('Erro ao salvar mensageiro. Verifique os dados.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">{mensageiroToEdit ? 'Editar Mensageiro' : 'Cadastro de Mensageiro'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="codigo">Código:</label>
            <input
              type="text"
              id="codigo"
              placeholder="Ex: 2348"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefone">Telefone:</label>
            <input
              type="text"
              id="telefone"
              placeholder="(33) 91234-1234"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-gravar" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Gravar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MensageiroFormModal;