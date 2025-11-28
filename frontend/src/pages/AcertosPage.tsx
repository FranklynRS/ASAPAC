import React, { useState, useEffect } from 'react';
import './AcertosPage.scss';
import { AcertosService, Lancamento, Acerto } from '../services/acertosService';
import AcertosFormModal from './AcertosFormModal';
import AcertosDetailsModal from './AcertosDetailsModal';
import LancamentoFormModal from './LancamentoFormModal';
import editarIcon from '../assets/editar.png';
import excluirIcon from '../assets/excluir.png';

import LancamentoEditModal from './LancamentoEditModal';
import AcertoEditModal from './AcertoEditModal';

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
  const [detailsModalConfig, setDetailsModalConfig] = useState({ title: 'Detalhes do Acerto', hideRecebimento: false });
  const [isLancamentoModalOpen, setIsLancamentoModalOpen] = useState(false);
  const [isLancamentoEditModalOpen, setIsLancamentoEditModalOpen] = useState(false);
  const [selectedLancamento, setSelectedLancamento] = useState<Lancamento | null>(null);
  const [isAcertoEditModalOpen, setIsAcertoEditModalOpen] = useState(false);
  const [selectedAcertoToEdit, setSelectedAcertoToEdit] = useState<Acerto | null>(null);

  const fetchCombinedData = async () => {
    try {
      const data = await AcertosService.fetchCombinedByMes(idMes);
      setLancamentos(data);
    } catch (err) {
      setError('Erro ao carregar os lançamentos.');
    }
  };

  const fetchAcertosData = async () => {
    try {
      const data = await AcertosService.fetchAcertosByMes(idMes);
      setAcertos(data);
    } catch (err) {
      setError('Erro ao carregar os acertos.');
    }
  };

  const handleOpenDetailsModal = (acerto: Acerto) => {
    setSelectedAcerto(acerto);
    setDetailsModalConfig({ title: 'Detalhes do Acerto', hideRecebimento: false });
    setIsDetailsModalOpen(true);
  };

  const handleOpenDetailsFromLancamento = (lancamentoId: string | number) => {
    const idString = String(lancamentoId);
    if (idString.includes('acerto')) {
       const realId = Number(idString.split('_').pop());
       const acertoOriginal = acertos.find(a => a.id_acerto === realId);
       
       if (acertoOriginal) {
         setSelectedAcerto(acertoOriginal);
         if (activeTab === 'Pagamentos') {
             setDetailsModalConfig({ title: 'Detalhes do Pagamento', hideRecebimento: true });
         } else {
             setDetailsModalConfig({ title: 'Detalhes do Acerto', hideRecebimento: false });
         }
         setIsDetailsModalOpen(true);
       }
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedAcerto(null);
  };

  const handleEditGeneric = (lancamento: Lancamento) => {
    const idString = String(lancamento.id_lancamento);
    
    if (idString.includes('acerto')) {
        const realId = Number(idString.split('_').pop());
        const acertoOriginal = acertos.find(a => a.id_acerto === realId);
        if (acertoOriginal) {
            handleOpenEditAcertoModal(acertoOriginal);
        }
    } else {
        handleOpenEditLancamentoModal(lancamento);
    }
  };

  const handleLancamentoSaved = (tipo: 'recebimento' | 'pagamento') => {
      if (tipo === 'recebimento') setActiveTab('Recebimentos');
      else setActiveTab('Pagamentos');
      fetchCombinedData();
  };

  const handleOpenEditLancamentoModal = (lancamento: Lancamento) => {
    setSelectedLancamento(lancamento);
    setIsLancamentoEditModalOpen(true);
  };

  const handleCloseEditLancamentoModal = () => {
    setSelectedLancamento(null);
    setIsLancamentoEditModalOpen(false);
  };

  const handleOpenEditAcertoModal = (acerto: Acerto) => {
    setSelectedAcertoToEdit(acerto);
    setIsAcertoEditModalOpen(true);
  };

  const handleCloseEditAcertoModal = () => {
    setSelectedAcertoToEdit(null);
    setIsAcertoEditModalOpen(false);
  };

  const handleDeleteLancamento = async (id: string | number) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
        const idString = String(id);
        if (idString.includes('acerto')) {
            const realId = Number(idString.split('_').pop());
            await AcertosService.deleteAcerto(realId);
            fetchAcertosData(); 
        } else {
            await AcertosService.deleteLancamento(id);
        }
        fetchCombinedData();
    }
  };

  const handleDeleteAcerto = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este acerto?')) {
        await AcertosService.deleteAcerto(id);
        fetchAcertosData();
        fetchCombinedData();
    }
  };

  useEffect(() => {
    if (idMes === null) return;
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCombinedData(), fetchAcertosData()]);
      setIsLoading(false);
    };
    fetchData();
  }, [idMes]);

  const totalRecebido = lancamentos
    .filter(l => l.categoria?.tipo === 1)
    .reduce((sum, l) => sum + l.valor, 0);

  const totalPago = lancamentos
    .filter(l => l.categoria?.tipo === 0)
    .reduce((sum, l) => sum + l.valor, 0);

  const saldoFinal = totalRecebido - totalPago;

  if (isLoading) return <div className="acertos-container">Carregando dados...</div>;
  if (error) return <div className="acertos-container error-message">{error}</div>;
  
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
          {['Recebimentos', 'Pagamentos', 'Acertos', 'Histórico'].map(tab => (
             <button
                key={tab}
                className={`tab-button${activeTab === tab ? ' tab-active' : ''}`}
                onClick={() => setActiveTab(tab as any)}
             >
                {tab}
             </button>
          ))}
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
                <th>Pagamento (Total)</th>
                <th>Detalhes</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {acertos.map(acerto => {
                const totalDespesasAcerto = Number(acerto.pagamento) + Number(acerto.gasolina) + Number(acerto.hotel) + Number(acerto.alimentacao) + Number(acerto.outros);
                
                return (
                  <tr key={acerto.id_acerto}>
                    <td>{acerto.nome_mensageiro}</td>
                    <td>
                      <span className="lancamento-valor valor--recebido">
                          + R$ {Number(acerto.valor_recebido).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td>
                      <span className="lancamento-valor valor--pago">
                          - R$ {totalDespesasAcerto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td>
                      <button className="btn-detalhes" onClick={() => handleOpenDetailsModal(acerto)}>Detalhes</button>
                    </td>
                    <td className="acao-buttons">
                      <button className="btn-editar" onClick={() => handleOpenEditAcertoModal(acerto)}>
                        <img src={editarIcon} alt="Editar" />
                      </button>
                      <button className="btn-excluir" onClick={() => handleDeleteAcerto(acerto.id_acerto)}>
                        <img src={excluirIcon} alt="Excluir" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table className="acertos-table">
            <thead>
              <tr>
                <th>Modalidade</th>
                <th>Valor</th>
                <th>Descrição</th>
                <th>Detalhes</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {lancamentos
                .filter(l => activeTab === 'Histórico' || l.categoria?.tipo === (activeTab === 'Recebimentos' ? 1 : 0))
                .map(lancamento => {
                  const isAcertoRow = String(lancamento.id_lancamento).includes('acerto');
                  
                  return (
                    <tr key={String(lancamento.id_lancamento)}>
                      <td>{lancamento.categoria?.nome_categoria}</td>
                      <td>
                        <span className={`lancamento-valor valor--${lancamento.categoria?.tipo === 1 ? 'recebido' : 'pago'}`}>
                          {lancamento.categoria?.tipo === 1 ? '+' : '-'} R$ {Number(lancamento.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td>{lancamento.descricao}</td>
                      
                      <td>
                        {isAcertoRow ? (
                          <button 
                             className="btn-detalhes" 
                             onClick={() => handleOpenDetailsFromLancamento(lancamento.id_lancamento)}
                          >
                             Detalhes
                          </button>
                        ) : (
                          <span style={{color: '#999', fontSize: '12px'}}>—</span>
                        )}
                      </td>

                      <td className="acao-buttons">
                        <button className="btn-editar" onClick={() => handleEditGeneric(lancamento)}>
                            <img src={editarIcon} alt="Editar" />
                        </button>
                        
                        <button className="btn-excluir" onClick={() => handleDeleteLancamento(lancamento.id_lancamento)}>
                          <img src={excluirIcon} alt="Excluir" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Modais (Mantive igual) */}
      <AcertosFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        onAcertoSaved={() => {fetchAcertosData(); fetchCombinedData();}} 
        idMes={idMes} 
      />
      <AcertosDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        acerto={selectedAcerto}
        title={detailsModalConfig.title}
        hideRecebimento={detailsModalConfig.hideRecebimento}
      />
      <LancamentoFormModal
        isOpen={isLancamentoModalOpen}
        onClose={() => setIsLancamentoModalOpen(false)}
        onLancamentoSaved={handleLancamentoSaved}
        idMes={idMes}
      />
      {isLancamentoEditModalOpen && selectedLancamento && (
          <LancamentoEditModal 
             isOpen={isLancamentoEditModalOpen} 
             onClose={handleCloseEditLancamentoModal} 
             lancamento={selectedLancamento} 
             onLancamentoSaved={() => {
                 fetchCombinedData();
                 handleCloseEditLancamentoModal();
             }}
          />
      )}
      {isAcertoEditModalOpen && selectedAcertoToEdit && (
          <AcertoEditModal 
             isOpen={isAcertoEditModalOpen} 
             onClose={handleCloseEditAcertoModal} 
             acerto={selectedAcertoToEdit} 
             onAcertoSaved={() => {
                 fetchAcertosData();
                 fetchCombinedData();
                 handleCloseEditAcertoModal();
             }}
          />
      )}
    </div>
  );
};

export default AcertosPage;