import React, { useState, useEffect } from 'react';
import './MensageirosFormModal.scss';
import { MensageirosService, Mensageiro } from '../services/mensageirosService';
import InputMask from '@mona-health/react-input-mask';
import Modal from 'react-modal';

interface MensageirosFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMensageiroSaved: () => void;
  mensageiroToEdit?: Mensageiro | null;
}

Modal.setAppElement('#root');

const MensageirosFormModal: React.FC<MensageirosFormModalProps> = ({ isOpen, onClose, onMensageiroSaved, mensageiroToEdit }) => {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [status, setStatus] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mensageiroToEdit) {
      setNome(mensageiroToEdit.nome_mensageiro);
      setCodigo(mensageiroToEdit.codigo_mensageiro);
      setTelefone(mensageiroToEdit.telefone);
      setStatus(!!mensageiroToEdit.status);
    } else {
      setNome('');
      setCodigo('');
      setTelefone('');
      setStatus(true);
    }
  }, [mensageiroToEdit, isOpen]);

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[0-9]/g, '');
    
    if (value.length <= 40) {
      setNome(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const mensageiroData = {
      nome_mensageiro: nome,
      codigo_mensageiro: codigo,
      telefone: telefone,
      status: status,
    };

    try {
      if (mensageiroToEdit) {
        await MensageirosService.updateMensageiro(mensageiroToEdit.id_mensageiro, mensageiroData);
      } else {
        await MensageirosService.createMensageiro(mensageiroData);
      }
      onMensageiroSaved(); 
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao salvar mensageiro.';
      setError(msg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={mensageiroToEdit ? 'Editar Mensageiro' : 'Cadastro de Mensageiro'}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <button className="modal-close-btn" onClick={onClose}>&times;</button>
      <h2 className="modal-title">{mensageiroToEdit ? 'Editar Mensageiro' : 'Cadastro de Mensageiro'}</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="codigo">Código:</label>
          <InputMask
            mask="9999"
            placeholder="Ex.:0001"
            value={codigo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCodigo(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            placeholder="Nome (Sem números)"
            value={nome}
            onChange={handleNomeChange}
            maxLength={40}
            required
          />
          <small className="char-count">{nome.length}/40</small>
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone:</label>
          <InputMask
            mask="(99) 99999-9999"
            placeholder="Ex.:(33) 99912-4569"
            value={telefone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={status ? 'true' : 'false'}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value === 'true')}
            required
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-gravar" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Gravar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MensageirosFormModal;