import React, { useState, useEffect } from 'react';
import './LancamentoFormModal.scss';
import { AcertosService, LancamentoData, Categoria } from '../services/acertosService';
import { AuthService } from '../services/auth';

interface LancamentoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLancamentoSaved: (tipo: 'recebimento' | 'pagamento') => void;
  idMes: number;
}

const LancamentoFormModal: React.FC<LancamentoFormModalProps> = ({ isOpen, onClose, onLancamentoSaved, idMes }) => {
  const [valor, setValor] = useState<number>(0);
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<'recebimento' | 'pagamento'>('recebimento');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const fetchedCategorias = await AcertosService.fetchCategorias();
          setCategorias(fetchedCategorias);
          setError(null);
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados do formulário.');
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const id_usuario = AuthService.getUserIdFromToken();
    if (!id_usuario) {
      setError('Erro de autenticação: ID do usuário não encontrado.');
      setIsLoading(false);
      return;
    }
    
    if (!selectedCategoriaId) {
      setError('Por favor, selecione uma modalidade.');
      setIsLoading(false);
      return;
    }
    
    try {
      const lancamentoData: LancamentoData = {
        valor: valor,
        descricao: descricao,
        tipo: tipo === 'recebimento' ? 1 : 0,
        id_mes: idMes,
        id_usuario: id_usuario,
        id_categoria: selectedCategoriaId,
      };
      
      await AcertosService.createLancamento(lancamentoData);
      onLancamentoSaved(tipo);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erro ao registrar lançamento. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Novo Lançamento</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="recebimento"
                  checked={tipo === 'recebimento'}
                  onChange={() => setTipo('recebimento')}
                />
                Recebimento
              </label>
              <label>
                <input
                  type="radio"
                  value="pagamento"
                  checked={tipo === 'pagamento'}
                  onChange={() => setTipo('pagamento')}
                />
                Pagamento
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label>Modalidade:</label>
            <select
              value={selectedCategoriaId || ''}
              onChange={e => setSelectedCategoriaId(Number(e.target.value))}
              required
            >
              <option value="">Escolher</option>
              {categorias
                .filter(c => c.tipo === (tipo === 'recebimento' ? 1 : 0))
                .map(c => (
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

export default LancamentoFormModal;