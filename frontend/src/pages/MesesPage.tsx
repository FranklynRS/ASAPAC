import React, { useState, useEffect } from 'react';
import './MesesPage.scss';
import { MesesService } from '../services/mesesService';

interface Mes {
  id: number;
  nome: string;
  valor: number;
  status: 'positivo' | 'negativo';
}

const MesesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [meses, setMeses] = useState<Mes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeses = async () => {
      try {
        // Altere para a nova função de serviço
        const data = await MesesService.fetchMesesComSaldo();
        setMeses(data);
      } catch (err) {
        setError('Erro ao carregar os meses. Por favor, tente novamente.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeses();
  }, []);

  const filteredMonths = meses.filter((month) =>
    month.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="meses-container">
        <h2>Histórico dos Meses</h2>
        <div className="meses-content">
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="meses-container">
        <h2>Histórico dos Meses</h2>
        <div className="meses-content">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="meses-container">
      <h2 className="meses-header">Histórico dos Meses</h2>
      <div className="meses-content">
        <input 
          type="text" 
          placeholder="Pesquisar mês" 
          className="meses-search" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="meses-table">
          {filteredMonths.map((month) => (
            <div key={month.id} className="meses-row">
              <span className="meses-row__name">{month.nome}</span>
              <span className={`meses-row__value meses-row__value--${month.status}`}>
                {month.status === 'positivo' ? '▲' : '▼'} R${Math.abs(month.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <button className="meses-row__button">Lançamentos</button>
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