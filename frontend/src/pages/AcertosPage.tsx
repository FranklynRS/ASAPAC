import React, { useState, useEffect } from 'react';
import './AcertosPage.scss';
import { AcertosService, Lancamento, Acerto } from '../services/acertosService';
import AcertosFormModal from './AcertosFormModal';
import AcertosDetailsModal from './AcertosDetailsModal';
import LancamentoFormModal from './LancamentoFormModal'; // Adicione esta importação
import editarIcon from '../assets/editar.png';
import excluirIcon from '../assets/excluir.png';
import refreshIcon from '../assets/refresh.png';

interface AcertosPageProps {
  idMes: number;
  mesNome: string;
  onVoltarClick: () => void;
}

const AcertosPage: React.FC<AcertosPageProps> = ({ idMes, mesNome, onVoltarClick }) => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [acertos, setAcertos] = useState<Acerto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Recebimentos' | 'Pagamentos' | 'Acertos' | 'Histórico'>('Histórico');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAcerto, setSelectedAcerto] = useState<Acerto | null>(null);
  const [isLancamentoModalOpen, setIsLancamentoModalOpen] = useState(false); // Novo estado

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

  const fetchAcertos = async () => {
    setIsLoading(true);
    try {
      const data = await AcertosService.fetchAcertosByMes(idMes);
      setAcertos(data);
    } catch (err) {
      setError('Erro ao carregar os acertos. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetailsModal = (acerto: Acerto) => {
    setSelectedAcerto(acerto);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAcerto(null);
  };

  useEffect(() => {
    if (idMes === null) return;
    
    if (activeTab === 'Acertos') {
        fetchAcertos();
    } else {
        fetchLancamentos();
    }
  }, [idMes, activeTab]);

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
        <div className="botoes-acao">
          <button className="btn-novo-lancamento" onClick={() => setIsLancamentoModalOpen(true)}>Novo Lançamento</button>
          <button className="btn-novo-lancamento" onClick={() => setIsFormModalOpen(true)}>Novo Acerto</button>
        </div>
      </div>

      <div className="acertos-table-wrapper">
        {activeTab === 'Acertos' ? (
          <table className="acertos-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Recebimento</th>
                <th>Pagamento</th>
                <th>Detalhes</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {acertos.map(acerto => (
                <tr key={acerto.id_acerto}>
                  <td>{acerto.nome_mensageiro}</td>
                  <td>R$ {Number(acerto.valor_recebido).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>R$ {Number(acerto.pagamento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <button className="btn-detalhes" onClick={() => handleOpenDetailsModal(acerto)}>Detalhes</button>
                  </td>
                  <td className="acao-buttons">
                    <button className="btn-editar">
                      <img src={editarIcon} alt="Editar" />
                    </button>
                    <button className="btn-excluir">
                      <img src={excluirIcon} alt="Excluir" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
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
        )}
      </div>
      <AcertosFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        onAcertoSaved={fetchAcertos} 
        idMes={idMes} 
      />
      <AcertosDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        acerto={selectedAcerto}
      />
      <LancamentoFormModal
        isOpen={isLancamentoModalOpen}
        onClose={() => setIsLancamentoModalOpen(false)}
        onLancamentoSaved={fetchLancamentos}
        idMes={idMes}
      />
    </div>
  );
};

export default AcertosPage;