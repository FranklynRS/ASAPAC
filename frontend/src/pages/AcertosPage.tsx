import React, { useState, useEffect } from 'react';
import './AcertosPage.scss';
import { AcertosService, Lancamento } from '../services/acertosService';
import AcertosFormModal from '../pages/AcertosFormModal';

interface AcertosPageProps {
  idMes: number;
  mesNome: string;
  onVoltarClick: () => void;
}

const AcertosPage: React.FC<AcertosPageProps> = ({ idMes, mesNome, onVoltarClick }) => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Recebimentos' | 'Pagamentos' | 'Acertos' | 'Histórico'>('Histórico');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLancamentos = async () => {
    setIsLoading(true);
    try {
      const data = await AcertosService.fetchLancamentosByMes(idMes);
      setLancamentos(data);
    } catch (err) {
      setError('Erro ao carregar os lançamentos. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (idMes === null) return;
    fetchLancamentos();
  }, [idMes]);

  const totalRecebido = lancamentos
    .filter(l => l.categoria.tipo === 1)
    .reduce((sum, l) => sum + l.valor, 0);

  const totalPago = lancamentos
    .filter(l => l.categoria.tipo === 0)
    .reduce((sum, l) => sum + l.valor, 0);

  const saldoFinal = totalRecebido - totalPago;

  let filteredLancamentos = lancamentos;
  if (activeTab === 'Recebimentos') {
    filteredLancamentos = lancamentos.filter(l => l.categoria.tipo === 1);
  } else if (activeTab === 'Pagamentos') {
    filteredLancamentos = lancamentos.filter(l => l.categoria.tipo === 0);
  } else if (activeTab === 'Acertos') {
    filteredLancamentos = lancamentos.filter(l => l.categoria.nome_categoria.toLowerCase().includes('acerto'));
  }

  const getButtonText = () => {
    switch (activeTab) {
      case 'Recebimentos':
        return 'Novo Recebimento';
      case 'Pagamentos':
        return 'Novo Pagamento';
      case 'Acertos':
        return 'Novo Acerto';
      default:
        return 'Novo Lançamento';
    }
  };

  if (isLoading) {
    return <div className="acertos-container">Carregando lançamentos...</div>;
  }

  if (error) {
    return <div className="acertos-container error-message">{error}</div>;
  }

  return (
    <div className="acertos-container">
      <div className="acertos-header-info">
        <button className="btn-voltar-acertos" onClick={onVoltarClick}>Voltar</button>
        <h2>{mesNome}</h2>
      </div>

      <div className="resumo-grid">
        <div className="resumo-card recebido">
          <div className="icon">▲</div>
          <div className="text">Total Recebido</div>
          <div className="valor">R$ {Number(totalRecebido).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="resumo-card pago">
          <div className="icon">▼</div>
          <div className="text">Total Pago</div>
          <div className="valor">R$ {Number(totalPago).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="resumo-card saldo">
          <div className="icon">✓</div>
          <div className="text">Saldo Final</div>
          <div className="valor">R$ {Number(saldoFinal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="acertos-table-controls">
        <div className="acertos-tabs">
          <button
            className={`tab-button${activeTab === 'Recebimentos' ? ' tab-active' : ''}`}
            onClick={() => setActiveTab('Recebimentos')}
          >
            Recebimentos
          </button>
          <button
            className={`tab-button${activeTab === 'Pagamentos' ? ' tab-active' : ''}`}
            onClick={() => setActiveTab('Pagamentos')}
          >
            Pagamentos
          </button>
          <button
            className={`tab-button${activeTab === 'Acertos' ? ' tab-active' : ''}`}
            onClick={() => setActiveTab('Acertos')}
          >
            Acertos
          </button>
          <button
            className={`tab-button${activeTab === 'Histórico' ? ' tab-active' : ''}`}
            onClick={() => setActiveTab('Histórico')}
          >
            Histórico
          </button>
        </div>
        <button className="btn-novo-lancamento" onClick={() => setIsModalOpen(true)}>{getButtonText()}</button>
      </div>

      <div className="acertos-table-wrapper">
        <table className="acertos-table">
          <thead>
            <tr>
              <th>Modalidade</th>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {filteredLancamentos.map(lancamento => (
              <tr key={lancamento.id_lancamento}>
                <td>{lancamento.categoria.nome_categoria}</td>
                <td>
                  <span className={`lancamento-valor valor--${lancamento.categoria.tipo === 1 ? 'recebido' : 'pago'}`}>
                    {lancamento.categoria.tipo === 1 ? '+' : '-'} R$ {Math.abs(lancamento.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td>{lancamento.descricao}</td>
                <td><button className="btn-detalhes">Detalhes</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AcertosFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAcertoSaved={fetchLancamentos} />
    </div>
  );
};

export default AcertosPage;