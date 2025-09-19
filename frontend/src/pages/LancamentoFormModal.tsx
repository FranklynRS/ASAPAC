import React, { useState } from 'react';
import './LancamentoFormModal.scss';
import { AcertosService, LancamentoData } from '../services/acertosService'; // Importe LancamentoData
import { AuthService } from '../services/auth';

interface LancamentoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLancamentoSaved: () => void;
  idMes: number;
}

const LancamentoFormModal: React.FC<LancamentoFormModalProps> = ({ isOpen, onClose, onLancamentoSaved, idMes }) => {
  const [valor, setValor] = useState<number>(0);
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<'recebimento' | 'pagamento'>('recebimento');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    
    try {
      const lancamentoData: LancamentoData = { // Adicione ": LancamentoData" aqui para tipar o objeto
        valor: valor,
        descricao: descricao,
        tipo: tipo === 'recebimento' ? 1 : 0, // 1 para Recebimento, 0 para Pagamento
        id_mes: idMes,
        id_usuario: id_usuario,
      };
      
      await AcertosService.createLancamento(lancamentoData);
      onLancamentoSaved(); // Atualiza a tabela
      onClose(); // Fecha o modal
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