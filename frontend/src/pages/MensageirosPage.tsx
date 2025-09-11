import React, { useState, useEffect } from 'react';
import './MensageirosPage.scss';
import { MensageirosService, Mensageiro } from '../services/mensageirosService';
import MensageiroFormModal from '../pages/MensageiroFormModal';
import editarIcon from '../assets/editar.png';
import excluirIcon from '../assets/excluir.png';
import refreshIcon from '../assets/refresh.png';

const MensageirosPage: React.FC = () => {
  const [mensageiros, setMensageiros] = useState<Mensageiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mensageiroToEdit, setMensageiroToEdit] = useState<Mensageiro | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMensageiros = async () => {
    setIsLoading(true);
    try {
      const data = await MensageirosService.fetchMensageiros();
      setMensageiros(data);
    } catch (err) {
      setError('Erro ao carregar os mensageiros. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMensageiros();
  }, []);

  const handleNovoMensageiroClick = () => {
    setMensageiroToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditarClick = (mensageiro: Mensageiro) => {
    setMensageiroToEdit(mensageiro);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMensageiroToEdit(null);
  };

  const handleMensageiroSaved = () => {
    fetchMensageiros();
  };

  const handleExcluirClick = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este mensageiro?')) {
      try {
        await MensageirosService.deleteMensageiro(id);
        fetchMensageiros();
      } catch (err) {
        setError('Erro ao excluir mensageiro.');
        console.error(err);
      }
    }
  };
  
  const filteredMensageiros = mensageiros.filter(m =>
    m.nome_mensageiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.codigo_mensageiro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="mensageiros-container">Carregando mensageiros...</div>;
  }

  if (error) {
    return <div className="mensageiros-container error-message">{error}</div>;
  }
  
  return (
    <div className="mensageiros-container">
      <div className="mensageiros-header">
        <h1>Lista de Mensageiros</h1>
        <button className="btn-novo-mensageiro" onClick={handleNovoMensageiroClick}>Novo Mensageiro</button>
      </div>

      <div className="mensageiros-content">
        <div className="mensageiros-search-bar">
          <input 
            type="text" 
            placeholder="Pesquisar mensageiro..." 
            className="mensageiros-search" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="mensageiros-refresh-button" onClick={fetchMensageiros}>
            <img src={refreshIcon} alt="Atualizar" />
          </button>
        </div>
        
        <div className="mensageiros-table-wrapper">
          <table className="mensageiros-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Editar/Excluir</th>
              </tr>
            </thead>
            <tbody>
              {filteredMensageiros.map((mensageiro) => (
                <tr key={mensageiro.id_mensageiro}>
                  <td>{mensageiro.codigo_mensageiro}</td>
                  <td>{mensageiro.nome_mensageiro}</td>
                  <td className="mensageiros-options">
                    <button className="btn-editar" onClick={() => handleEditarClick(mensageiro)}>
                      <img src={editarIcon} alt="Editar" />
                    </button>
                    <button className="btn-excluir" onClick={() => handleExcluirClick(mensageiro.id_mensageiro)}>
                      <img src={excluirIcon} alt="Excluir" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MensageiroFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onMensageiroSaved={handleMensageiroSaved}
        mensageiroToEdit={mensageiroToEdit}
      />
    </div>
  );
};

export default MensageirosPage;