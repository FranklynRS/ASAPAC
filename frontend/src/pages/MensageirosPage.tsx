import React, { useState, useEffect, useRef } from 'react';
import './MensageirosPage.scss';
import { MensageirosService, Mensageiro } from '../services/mensageirosService';
import MensageirosFormModal from '../pages/MensageirosFormModal'; 
import MensageiroDetailsModal from '../pages/MensageirosDetailsModal';
import editarIcon from '../assets/editar.png';
import refreshIcon from '../assets/refresh.png';
import filtroIcon from '../assets/filtro.png';

const MensageirosPage: React.FC = () => {
  const [mensageiros, setMensageiros] = useState<Mensageiro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [mensageiroToEdit, setMensageiroToEdit] = useState<Mensageiro | null>(null);
  const [mensageiroToView, setMensageiroToView] = useState<Mensageiro | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]); 
  const [filters, setFilters] = useState({
      ordem: 'novo',
      status: '', // '' = todos, 'ativo', 'inativo'
      created_by: ''
  });
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      fetch('http://127.0.0.1:8000/api/usuarios', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Erro ao buscar usuários', err));
  }, []);

  const fetchMensageiros = async () => {
    setIsLoading(true);
    try {
      const data = await MensageirosService.fetchMensageiros({
          ...filters,
          search: searchTerm
      });
      setMensageiros(data);
    } catch (err) {
      setError('Erro ao carregar mensageiros.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMensageiros();
  }, [filters, searchTerm]); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
            setIsFilterOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const removeFilter = (key: string) => {
      setFilters(prev => ({ ...prev, [key]: key === 'ordem' ? 'novo' : '' }));
  };

  const handleNovoMensageiroClick = () => { setMensageiroToEdit(null); setIsFormModalOpen(true); };
  const handleEditarClick = (mensageiro: Mensageiro) => { setMensageiroToEdit(mensageiro); setIsFormModalOpen(true); };
  const handleDetalhesClick = (mensageiro: Mensageiro) => { setMensageiroToView(mensageiro); setIsDetailsModalOpen(true); };
  const handleCloseFormModal = () => { setIsFormModalOpen(false); setMensageiroToEdit(null); };
  const handleCloseDetailsModal = () => { setIsDetailsModalOpen(false); setMensageiroToView(null); };
  const handleMensageiroSaved = () => {
    fetchMensageiros();
    setSuccessMessage('Mensageiro salvo!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="mensageiros-container">
      {successMessage && <div className="success-popup">{successMessage}</div>}
      <div className="mensageiros-header-row">
        <h1>Lista de Mensageiros</h1>
        <button className="btn-novo-mensageiro" onClick={handleNovoMensageiroClick}>Novo Mensageiro</button>
      </div>

      <div className="search-controls-row">
        <div className="search-bar-wrapper">
            <div className="active-filters">
                {filters.status && (
                    <span className="filter-chip">
                        Status: {filters.status} <span className="chip-remove" onClick={() => removeFilter('status')}>x</span>
                    </span>
                )}
                {filters.created_by && (
                    <span className="filter-chip">
                        Por Usuário <span className="chip-remove" onClick={() => removeFilter('created_by')}>x</span>
                    </span>
                )}
                {filters.ordem === 'antigo' && (
                    <span className="filter-chip">
                        Mais Antigos <span className="chip-remove" onClick={() => removeFilter('ordem')}>x</span>
                    </span>
                )}
            </div>

            <input 
              type="text" 
              placeholder="Pesquisar mensageiro..." 
              className="search-input-nofix" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="filter-container" ref={filterRef}>
                <button className="btn-filter-icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    <img src={filtroIcon} alt="Filtrar" />
                </button>

                {isFilterOpen && (
                    <div className="filter-dropdown-menu">
                        <div className="filter-section">
                            <h3>Ordenação</h3>
                            <label><input type="radio" name="ordem" checked={filters.ordem === 'novo'} onChange={() => setFilters({...filters, ordem: 'novo'})} /> Mais Novo</label>
                            <label><input type="radio" name="ordem" checked={filters.ordem === 'antigo'} onChange={() => setFilters({...filters, ordem: 'antigo'})} /> Mais Antigo</label>
                        </div>
                        <div className="filter-section">
                            <h3>Status</h3>
                            <label><input type="radio" name="status" checked={filters.status === ''} onChange={() => setFilters({...filters, status: ''})} /> Todos</label>
                            <label><input type="radio" name="status" checked={filters.status === 'ativo'} onChange={() => setFilters({...filters, status: 'ativo'})} /> Ativo</label>
                            <label><input type="radio" name="status" checked={filters.status === 'inativo'} onChange={() => setFilters({...filters, status: 'inativo'})} /> Inativo</label>
                        </div>
                        <div className="filter-section">
                            <h3>Criado Por</h3>
                            <select value={filters.created_by} onChange={e => setFilters({...filters, created_by: e.target.value})}>
                                <option value="">Todos</option>
                                {usuarios.map(u => (
                                    <option key={u.id_usuario} value={u.id_usuario}>{u.nome_usuario}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        <button className="btn-refresh" onClick={fetchMensageiros}>
          <img src={refreshIcon} alt="Atualizar" />
        </button>
      </div>

      <div className="mensageiros-table-wrapper">
        <table className="mensageiros-table">
          <thead>
            <tr>
              <th>Código</th><th>Nome</th><th>Detalhes</th><th>Status</th><th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {mensageiros.map((m) => (
              <tr key={m.id_mensageiro}>
                <td>{m.codigo_mensageiro}</td>
                <td>{m.nome_mensageiro}</td>
                <td><button className="btn-detalhes" onClick={() => handleDetalhesClick(m)}>Detalhes</button></td>
                <td className={`mensageiro-status status--${m.status ? 'ativo' : 'inativo'}`}>{m.status ? 'Ativo' : 'Inativo'}</td>
                <td className="mensageiros-options">
                  <button className="btn-editar" onClick={() => handleEditarClick(m)}><img src={editarIcon} alt="Editar" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <MensageirosFormModal isOpen={isFormModalOpen} onClose={handleCloseFormModal} onMensageiroSaved={handleMensageiroSaved} mensageiroToEdit={mensageiroToEdit} />
      <MensageiroDetailsModal isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal} mensageiro={mensageiroToView} />
    </div>
  );
};

export default MensageirosPage;