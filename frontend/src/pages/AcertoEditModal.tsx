import React, { useState, useEffect } from 'react';
import './AcertoEditModal.scss';
import { AcertosService, Acerto, Mensageiro } from '../services/acertosService';
import { AuthService } from '../services/auth';

interface AcertoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  acerto: Acerto | null;
  onAcertoSaved: () => void;
}

const AcertoEditModal: React.FC<AcertoEditModalProps> = ({ isOpen, onClose, acerto, onAcertoSaved }) => {
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
    if (isOpen && acerto) {
      setValorRecebido(acerto.valor_recebido);
      setPagamento(acerto.pagamento);
      setGasolina(acerto.gasolina);
      setHotel(acerto.hotel);
      setAlimentacao(acerto.alimentacao);
      setOutros(acerto.outros);

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
  }, [isOpen, acerto]);

  useEffect(() => {
    const totalDespesas = gasolina + hotel + alimentacao + outros;
    setSaldo(valorRecebido - pagamento - totalDespesas);
  }, [valorRecebido, pagamento, gasolina, hotel, alimentacao, outros]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!acerto) {
      setError('Acerto inválido.');
      setIsLoading(false);
      return;
    }
    
    try {
      const acertosData = {
        id_mensageiro: selectedMensageiroId || acerto.id_mensageiro,
        valor_recebido: valorRecebido,
        pagamento: pagamento,
        gasolina: gasolina,
        hotel: hotel,
        alimentacao: alimentacao,
        outros: outros,
      };
      
      await AcertosService.updateAcerto(acerto.id_acerto, acertosData);
      onAcertoSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erro ao registrar acerto.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !acerto) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2 className="modal-title">Editar Acerto</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Selecionar Mensageiro</label>
              <select
                value={selectedMensageiroId || acerto.id_mensageiro || ''}
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

export default AcertoEditModal;