import React, { useState, useEffect } from 'react';
import './AcertosFormModal.scss';
import { AcertosService, Mensageiro } from '../services/acertosService';
import { AuthService } from '../services/auth';

interface AcertosFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcertoSaved: () => void;
  idMes: number;
}

const AcertosFormModal: React.FC<AcertosFormModalProps> = ({ isOpen, onClose, onAcertoSaved, idMes }) => {
  const [mensageiros, setMensageiros] = useState<Mensageiro[]>([]);
  const [selectedMensageiroId, setSelectedMensageiroId] = useState<number | null>(null);
  const [valorRecebido, setValorRecebido] = useState<number>(0);
  const [pagamento, setPagamento] = useState<number>(0);
  const [gasolina, setGasolina] = useState<number>(0);
  const [hotel, setHotel] = useState<number>(0);
  const [alimentacao, setAlimentacao] = useState<number>(0);
  const [outros, setOutros] = useState<number>(0);
  const [saldo, setSaldo] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const fetchedMensageiros = await AcertosService.fetchMensageiros();
          setMensageiros(fetchedMensageiros);
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados do formulário.');
        }
      };
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    const totalDespesas = gasolina + hotel + alimentacao + outros;
    setSaldo(valorRecebido - pagamento - totalDespesas);
  }, [valorRecebido, pagamento, gasolina, hotel, alimentacao, outros]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!selectedMensageiroId) {
      setError('Por favor, selecione um mensageiro.');
      setIsLoading(false);
      return;
    }
    
    // Obtém o ID do usuário do token de autenticação
    const id_usuario = AuthService.getUserIdFromToken();
    if (!id_usuario) {
      setError('Erro de autenticação: ID do usuário não encontrado.');
      setIsLoading(false);
      return;
    }

    try {
      const acertosData = {
        id_mensageiro: selectedMensageiroId,
        valor_recebido: valorRecebido,
        pagamento: pagamento,
        gasolina: gasolina,
        hotel: hotel,
        alimentacao: alimentacao,
        outros: outros,
        id_usuario: id_usuario, // Adiciona o ID do usuário aqui
        mes_id: idMes,
      };
      await AcertosService.createAcerto(acertosData);
      onAcertoSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erro ao registrar acerto. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Realizar Acerto</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Selecionar Mensageiro</label>
              <select
                value={selectedMensageiroId || ''}
                onChange={e => setSelectedMensageiroId(Number(e.target.value))}
                required
              >
                <option value="">Escolher</option>
                {mensageiros.map(m => (
                  <option key={m.id_mensageiro} value={m.id_mensageiro}>{m.nome_mensageiro}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Valor Recebido:</label>
              <input type="number" value={valorRecebido} onChange={e => setValorRecebido(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Pagamento:</label>
              <input type="number" value={pagamento} onChange={e => setPagamento(Number(e.target.value))} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gasolina:</label>
              <input type="number" value={gasolina} onChange={e => setGasolina(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Hotel:</label>
              <input type="number" value={hotel} onChange={e => setHotel(Number(e.target.value))} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Alimentação:</label>
              <input type="number" value={alimentacao} onChange={e => setAlimentacao(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Outros:</label>
              <input type="number" value={outros} onChange={e => setOutros(Number(e.target.value))} />
            </div>
          </div>
          
          <div className="form-footer">
            <p className="saldo-final">Saldo: R$ {saldo.toFixed(2)}</p>
            <button type="submit" className="btn-gravar" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Gravar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcertosFormModal;