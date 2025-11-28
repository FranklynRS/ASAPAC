import React, { useState, useEffect } from 'react';
import './MesesPage.scss';
import { MesesService } from '../services/mesesService';
import refreshIcon from '../assets/refresh.png';
import { AuthService } from '../services/auth';

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
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchMeses = async () => {
    setIsLoading(true);
    try {
      const data = await MesesService.fetchMesesComSaldos();
      setMeses(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar os meses.');
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

  const handleDownloadReport = async (idMes: number, mesNome: string) => {
    setIsDownloading(true);
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error('Token não encontrado.');

      const response = await fetch(`http://127.0.0.1:8000/api/relatorio/${idMes}/emitir`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Falha ao gerar o relatório.');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-mensal-${mesNome}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
      setError('Erro ao gerar relatório.');
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    fetchMeses();
  }, []);

  const filteredMonths = meses.filter((month) =>
    month.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVoltarClick = () => {
    setError(null);
    fetchMeses();
  };

  if (isLoading) return <div className="meses-container"><p>Carregando dados...</p></div>;

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
                {/* CORREÇÃO DO NAN AQUI: Adicionado || 0 e conversão Number */}
                <span className={`meses-row__value meses-row__value--${month.status}`}>
                  {month.status === 'positivo' ? '▲' : '▼'} R$ {Math.abs(Number(month.valor || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <div className="meses-row-buttons">
                    <button className="meses-row__button" onClick={() => onLancamentosClick({ id: month.id, nome: month.nome })}>
                        Lançamentos
                    </button>
                    <button 
                        className="meses-row__button-relatorio" 
                        onClick={() => handleDownloadReport(month.id, month.nome)} 
                        disabled={isDownloading}
                    >
                        {isDownloading ? 'Gerando...' : 'Relatório'}
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MesesPage;