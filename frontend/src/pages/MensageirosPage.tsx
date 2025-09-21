import React, { useState, useEffect } from 'react';
import './MensageirosPage.scss';
import { MensageirosService, Mensageiro } from '../services/mensageirosService';
import MensageiroFormModal from '../pages/MensageiroFormModal';
import MensageiroDetailsModal from '../pages/MensageirosDetailsModal';
import editarIcon from '../assets/editar.png';
import refreshIcon from '../assets/refresh.png';

const MensageirosPage: React.FC = () => {
  const [mensageiros, setMensageiros] = useState<Mensageiro[]>([]);
  const [todosMensageiros, setTodosMensageiros] = useState<Mensageiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [mensageiroToEdit, setMensageiroToEdit] = useState<Mensageiro | null>(null);
  const [mensageiroToView, setMensageiroToView] = useState<Mensageiro | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMensageiros = async () => {
    setIsLoading(true);
    try {
      const data: Mensageiro[] = await MensageirosService.fetchMensageiros();
      setTodosMensageiros(data);
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

  useEffect(() => {
    const filteredData = todosMensageiros.filter((m) =>
      m.nome_mensageiro.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.codigo_mensageiro.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMensageiros(filteredData);
  }, [searchTerm, todosMensageiros]);

  const handleNovoMensageiroClick = () => {
    setMensageiroToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditarClick = (mensageiro: Mensageiro) => {
    setMensageiroToEdit(mensageiro);
    setIsFormModalOpen(true);
  };

  const handleDetalhesClick = (mensageiro: Mensageiro) => {
    setMensageiroToView(mensageiro);
    setIsDetailsModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setMensageiroToEdit(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setMensageiroToView(null);
  };

  const handleMensageiroSaved = () => {
    fetchMensageiros();
  };

  if (isLoading) {
    return <div className="mensageiros-container">Carregando mensageiros...</div>;
  }

  if (error) {
    return <div className="mensageiros-container error-message">{error}</div>;
  }
  
  return (
    <div className="mensageiros-container">
      <div className="mensageiros-header-row">
        <h1>Lista de Mensageiros</h1>
        <button className="btn-novo-mensageiro" onClick={handleNovoMensageiroClick}>Novo Mensageiro</button>
      </div>

      <div className="search-controls-row">
        <input
          type="text"
          placeholder="Pesquisar mensageiro..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-refresh" onClick={fetchMensageiros}>
          <img src={refreshIcon} alt="Atualizar" />
        </button>
      </div>

      <div className="mensageiros-table-wrapper">
        <table className="mensageiros-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Detalhes</th>
              <th>Status</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {mensageiros.map((mensageiro) => (
              <tr key={mensageiro.id_mensageiro}>
                <td>{mensageiro.codigo_mensageiro}</td>
                <td>{mensageiro.nome_mensageiro}</td>
                <td>
                  <button className="btn-detalhes" onClick={() => handleDetalhesClick(mensageiro)}>
                    Detalhes
                  </button>
                </td>
                <td className={`mensageiro-status status--${mensageiro.status ? 'ativo' : 'inativo'}`}>
                  {mensageiro.status ? 'Ativo' : 'Inativo'}
                </td>
                <td className="mensageiros-options">
                  <button className="btn-editar" onClick={() => handleEditarClick(mensageiro)}>
                    <img src={editarIcon} alt="Editar" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MensageiroFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onMensageiroSaved={handleMensageiroSaved}
        mensageiroToEdit={mensageiroToEdit}
      />
      <MensageiroDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        mensageiro={mensageiroToView}
      />
    </div>
  );
};

export default MensageirosPage;