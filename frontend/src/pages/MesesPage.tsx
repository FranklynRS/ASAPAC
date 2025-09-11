import React, { useState, useEffect } from 'react';
import './MesesPage.scss';
import { MesesService } from '../services/mesesService';
import refreshIcon from '../assets/refresh.png';

interface Mes {
  id: number;
  nome: string;
  valor: number;
  status: 'positivo' | 'negativo';
}

interface MesesPageProps {
  onLancamentosClick: (mes: { id: number; nome: string }) => void;
}

const MesesPage: React.FC<MesesPageProps> = ({ onLancamentosClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [meses, setMeses] = useState<Mes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMonth, setNewMonth] = useState('');

  const fetchMeses = async () => {
    setIsLoading(true);
    try {
      const data = await MesesService.fetchMesesComSaldos();
      setMeses(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os meses. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCadastrarMes = async () => {
    if (!newMonth) {
      setError('Por favor, selecione um mês para cadastrar.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      await MesesService.cadastrarMes(newMonth);
      setNewMonth('');
      await fetchMeses();
    } catch (err) {
      setError('Erro ao cadastrar mês. Verifique se o mês já existe.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeses();
  }, []);

  const filteredMonths = meses.filter((month) =>
    month.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVoltarClick = () => {
    setError(null); // Reseta o estado de erro
    fetchMeses(); // Opcional: recarregar a lista
  };

  if (isLoading) {
    return (
      <div className="meses-container">
        <h2 className="meses-header">Histórico dos Meses</h2>
        <div className="meses-content">
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meses-container">
        <div className="meses-error-screen">
          <p className="error-message">{error}</p>
          <button onClick={handleVoltarClick} className="btn-voltar">Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="meses-container">
      <div className="meses-controls-row">
        <h2 className="meses-header">Histórico dos Meses</h2>
        <div className="cadastro-mes-container">
          <input 
            type="month" 
            id="mes" 
            name="mes"
            value={newMonth}
            onChange={(e) => setNewMonth(e.target.value)}
          />
          <button className="btn-cadastrar-mes" onClick={handleCadastrarMes}>Cadastrar Mês</button>
        </div>
      </div>
      
      <div className="meses-search-bar-row">
        <input 
          type="text" 
          placeholder="Pesquisar mês" 
          className="meses-search" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="meses-refresh-button" onClick={fetchMeses}>
          <img src={refreshIcon} alt="Atualizar" />
        </button>
      </div>

      <div className="meses-content">
        <div className="meses-table">
          {filteredMonths.map((month) => (
            <div key={month.id} className="meses-row">
              <span className="meses-row__name">{month.nome}</span>
              <div className="meses-row__right">
                <span className={`meses-row__value meses-row__value--${month.status}`}>
                  {month.status === 'positivo' ? '▲' : '▼'} R${Math.abs(month.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <button className="meses-row__button" onClick={() => onLancamentosClick({ id: month.id, nome: month.nome })}>
                  Lançamentos
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="meses-scroll-button">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-320 280-520l56-56 144 144 144-144 56 56-200 200ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
        </div>
      </div>
    </div>
  );
};

export default MesesPage;