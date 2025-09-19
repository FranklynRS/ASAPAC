import React, { useState, useEffect } from 'react';
import './LancamentoEditModal.scss'; // Crie este arquivo SCSS
import { AcertosService, Lancamento, Categoria, LancamentoData } from '../services/acertosService';
import { AuthService } from '../services/auth';

interface LancamentoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  lancamento: Lancamento | null;
  onLancamentoSaved: () => void;
}

const LancamentoEditModal: React.FC<LancamentoEditModalProps> = ({ isOpen, onClose, lancamento, onLancamentoSaved }) => {
  const [valor, setValor] = useState<number>(0);
  const [descricao, setDescricao] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && lancamento) {
      setValor(Number(lancamento.valor));
      setDescricao(lancamento.descricao);
      setSelectedCategoriaId(lancamento.categoria.id_categoria);

      const fetchCategorias = async () => {
        try {
          const fetchedCategorias = await AcertosService.fetchCategorias();
          setCategorias(fetchedCategorias);
          setError(null);
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar as categorias.');
        }
      };
      fetchCategorias();
    }
  }, [isOpen, lancamento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!lancamento || !selectedCategoriaId) {
      setError('Lançamento ou modalidade inválidos.');
      setIsLoading(false);
      return;
    }
    
    try {
      const updatedLancamento: LancamentoData = {
        valor: valor,
        descricao: descricao,
        id_categoria: selectedCategoriaId,
        // Campos que não mudam
        id_mes: 0, // placeholder, será sobrescrito
        id_usuario: 0, // placeholder, será sobrescrito
        tipo: lancamento.categoria.tipo, // mantém o tipo original
      };
      
      await AcertosService.updateLancamento(lancamento.id_lancamento, updatedLancamento);
      onLancamentoSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar as alterações.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !lancamento) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Editar Lançamento</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Modalidade:</label>
              <select
                value={selectedCategoriaId || ''}
                onChange={e => setSelectedCategoriaId(Number(e.target.value))}
                required
              >
                <option value="">Escolher</option>
                {categorias.filter(c => c.tipo === lancamento.categoria.tipo).map(c => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nome_categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Valor:</label>
              <input
                type="number"
                value={valor}
                onChange={e => setValor(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Descrição:</label>
            <input
              type="text"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              required
            />
          </div>
          <div className="form-footer">
            <button type="submit" className="btn-gravar" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Gravar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LancamentoEditModal;