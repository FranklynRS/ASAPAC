import React, { useState, useEffect } from 'react';
import './AcertosFormModal.scss';
import { AcertosService, Mensageiro, Categoria } from '../services/acertosService';

interface AcertosFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAcertoSaved: () => void;
}

const AcertosFormModal: React.FC<AcertosFormModalProps> = ({ isOpen, onClose, onAcertoSaved }) => {
  const [mensageiros, setMensageiros] = useState<Mensageiro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [selectedMensageiroId, setSelectedMensageiroId] = useState<number | null>(null);
  const [valorRecebido, setValorRecebido] = useState<number>(0);
  const [pagamento, setPagamento] = useState<number>(0);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);
  const [categoriaValor, setCategoriaValor] = useState<number>(0);
  const [categoriasAdicionadas, setCategoriasAdicionadas] = useState<Array<{ categoria: Categoria; valor: number }>>([]);
  const [saldo, setSaldo] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const fetchedMensageiros = await AcertosService.fetchMensageiros();
          setMensageiros(fetchedMensageiros);
          const fetchedCategorias = await AcertosService.fetchCategorias();
          setCategorias(fetchedCategorias);
        } catch (err) {
          console.error(err);
          setError('Erro ao carregar dados do formulário.');
        }
      };
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    const totalCategorias = categoriasAdicionadas.reduce((sum, item) => sum + item.valor, 0);
    setSaldo(valorRecebido - pagamento - totalCategorias);
  }, [valorRecebido, pagamento, categoriasAdicionadas]);

  const handleAddCategoria = () => {
    if (selectedCategoriaId !== null && categoriaValor > 0) {
      const categoria = categorias.find(c => c.id_categoria === selectedCategoriaId);
      if (categoria) {
        setCategoriasAdicionadas([...categoriasAdicionadas, { categoria, valor: categoria.tipo === 0 ? -categoriaValor : categoriaValor }]);
        setSelectedCategoriaId(null);
        setCategoriaValor(0);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!selectedMensageiroId || categoriasAdicionadas.length === 0) {
      setError('Por favor, selecione um mensageiro e adicione categorias.');
      setIsLoading(false);
      return;
    }

    try {
      const acertosData = {
        id_mensageiro: selectedMensageiroId,
        valor_recebido: valorRecebido,
        pagamento: pagamento,
        categorias: categoriasAdicionadas.map(item => ({
          id_categoria: item.categoria.id_categoria,
          valor: item.valor,
        })),
      };
      await AcertosService.createAcerto(acertosData);
      onAcertoSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Erro ao registrar acerto.');
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
              <label>Valor Recebido</label>
              <input type="number" value={valorRecebido} onChange={e => setValorRecebido(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Pagamento</label>
              <input type="number" value={pagamento} onChange={e => setPagamento(Number(e.target.value))} />
            </div>
          </div>
          
          <div className="categorias-section">
            <div className="form-group">
              <label>Categorias</label>
              <select
                value={selectedCategoriaId || ''}
                onChange={e => setSelectedCategoriaId(Number(e.target.value))}
              >
                <option value="">Escolher</option>
                {categorias.map(c => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.nome_categoria}</option>
                ))}
              </select>
            </div>
            <div className="form-group-valor">
              <input 
                type="number" 
                placeholder="Valor R$" 
                value={categoriaValor} 
                onChange={e => setCategoriaValor(Number(e.target.value))}
              />
              <button type="button" onClick={handleAddCategoria}>Confirmar</button>
            </div>
          </div>

          <div className="mini-tabela">
            <h4>Categorias adicionadas:</h4>
            {categoriasAdicionadas.length > 0 ? (
              <ul>
                {categoriasAdicionadas.map((item, index) => (
                  <li key={index}>{item.categoria.nome_categoria}: R$ {item.valor}</li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma categoria adicionada.</p>
            )}
          </div>

          <div className="form-footer">
            <p className="saldo-final">Saldo: **R$ {saldo.toFixed(2)}**</p>
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