import React, { useState, useEffect } from 'react';
import './CategoriasFormModal.scss';
import { CategoriaService, Categoria } from '../services/categoriaService';

interface CategoriaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriaSaved: () => void;
  categoriaToEdit?: Categoria | null;
}

const CategoriasFormModal: React.FC<CategoriaFormModalProps> = ({ isOpen, onClose, onCategoriaSaved, categoriaToEdit }) => {
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<'0' | '1' | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categoriaToEdit) {
      setNomeCategoria(categoriaToEdit.nome_categoria);
      setDescricao(categoriaToEdit.descricao || '');
      setTipo(categoriaToEdit.tipo.toString() as '0' | '1' | '');
    } else {
      setNomeCategoria('');
      setDescricao('');
      setTipo('');
    }
  }, [categoriaToEdit, isOpen]);

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[0-9]/g, '');
    
    if (value.length <= 40) {
      setNomeCategoria(value);
    }
  };

  const handleDescricaoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setDescricao(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const categoriaData = {
      nome_categoria: nomeCategoria,
      descricao: descricao,
      tipo: parseInt(tipo as string, 10),
    };

    try {
      if (categoriaToEdit) {
        await CategoriaService.updateCategoria(categoriaToEdit.id_categoria, categoriaData);
      } else {
        await CategoriaService.createCategoria(categoriaData);
      }
      onCategoriaSaved();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao salvar categoria. Verifique os dados.';
      setError(msg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">{categoriaToEdit ? 'Editar Categoria' : 'Nova Categoria'}</h2>
        
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome_categoria">Nome da Categoria:</label>
            <input
              type="text"
              id="nome_categoria"
              value={nomeCategoria}
              onChange={handleNomeChange}
              maxLength={40}
              placeholder="Ex: Transporte (Sem números)"
              required
            />
            <small className="char-count">{nomeCategoria.length}/40</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="descricao">Descrição:</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={handleDescricaoChange}
              maxLength={200}
              rows={4}
            />
            <small className="char-count">{descricao.length}/200</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="tipo">Tipo:</label>
            <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as '0' | '1' | '')} required>
              <option value="">Selecione o tipo</option>
              <option value="1">Receita</option>
              <option value="0">Gasto</option>
            </select>
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

export default CategoriasFormModal;