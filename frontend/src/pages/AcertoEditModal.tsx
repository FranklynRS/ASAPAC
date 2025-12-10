import React, { useState, useEffect } from 'react';
import './AcertoEditModal.scss';
import { AcertosService, Acerto, Mensageiro } from '../services/acertosService';

interface AcertoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  acerto: Acerto | null;
  onAcertoSaved: () => void;
}

const AcertoEditModal: React.FC<AcertoEditModalProps> = ({ isOpen, onClose, acerto, onAcertoSaved }) => {
  const [mensageiros, setMensageiros] = useState<Mensageiro[]>([]);
  const [selectedMensageiroId, setSelectedMensageiroId] = useState<number | null>(null);
  const [valorRecebido, setValorRecebido] = useState<string>('');
  const [pagamento, setPagamento] = useState<string>('');
  const [gasolina, setGasolina] = useState<string>('');
  const [hotel, setHotel] = useState<string>('');
  const [alimentacao, setAlimentacao] = useState<string>('');
  const [outros, setOutros] = useState<string>('');
  
  const [saldo, setSaldo] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && acerto) {
      setValorRecebido(String(acerto.valor_recebido));
      setPagamento(String(acerto.pagamento));
      setGasolina(String(acerto.gasolina));
      setHotel(String(acerto.hotel));
      setAlimentacao(String(acerto.alimentacao));
      setOutros(String(acerto.outros));
      
      if (acerto.id_mensageiro) {
          setSelectedMensageiroId(Number(acerto.id_mensageiro));
      }

      const fetchMensageiros = async () => {
        try {
          const fetchedMensageiros = await AcertosService.fetchMensageiros();
          setMensageiros(fetchedMensageiros);
          setError(null);
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar lista de mensageiros.');
        }
      };
      fetchMensageiros();
    }
  }, [isOpen, acerto]);

  useEffect(() => {
    const totalDespesas = Number(gasolina) + Number(hotel) + Number(alimentacao) + Number(outros);
    setSaldo(Number(valorRecebido) - Number(pagamento) - totalDespesas);
  }, [valorRecebido, pagamento, gasolina, hotel, alimentacao, outros]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!acerto || !acerto.id_acerto) {
        setError('Erro: ID do acerto inválido ou não encontrado.');
        setIsLoading(false);
        return;
    }
    
    if (!selectedMensageiroId) {
        setError('Selecione um mensageiro.');
        setIsLoading(false);
        return;
    }

    try {
      const acertosData = {
        id_mensageiro: selectedMensageiroId,
        valor_recebido: Number(valorRecebido),
        pagamento: Number(pagamento),
        gasolina: Number(gasolina),
        hotel: Number(hotel),
        alimentacao: Number(alimentacao),
        outros: Number(outros),
        mes_id: acerto.mes_id || 0,
        id_usuario: acerto.id_usuario || 0
      };
      
      await AcertosService.updateAcerto(acerto.id_acerto, acertosData);
      onAcertoSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erro ao atualizar acerto.');
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
                value={selectedMensageiroId || ''}
                onChange={e => setSelectedMensageiroId(Number(e.target.value))}
                required
              >
                <option value="">Escolher</option>
                {mensageiros.map(m => (
                  <option key={m.id_mensageiro} value={m.id_mensageiro}>
                    {m.nome_mensageiro}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valor Recebido:</label>
              <input type="number" step="0.01" value={valorRecebido} onChange={e => setValorRecebido(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Pagamento:</label>
              <input type="number" step="0.01" value={pagamento} onChange={e => setPagamento(e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gasolina:</label>
              <input type="number" step="0.01" value={gasolina} onChange={e => setGasolina(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Hotel:</label>
              <input type="number" step="0.01" value={hotel} onChange={e => setHotel(e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Alimentação:</label>
              <input type="number" step="0.01" value={alimentacao} onChange={e => setAlimentacao(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Outros:</label>
              <input type="number" step="0.01" value={outros} onChange={e => setOutros(e.target.value)} />
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