import React, { useState, useEffect, useRef } from 'react';
import './CategoriasPage.scss';
import { CategoriaService, Categoria } from '../services/categoriaService';
import CategoriasFormModal from '../pages/CategoriasFormModal';
import CategoriasDetailsModal from '../pages/CategoriasDetailsModal';
import editarIcon from '../assets/editar.png';
import refreshIcon from '../assets/refresh.png';
import filtroIcon from '../assets/filtro.png';

interface CategoriaComDetalhes extends Categoria {
  created_at: string;
  created_by_user_name: string;
  descricao: string | null;
}

const CategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = useState<CategoriaComDetalhes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [filters, setFilters] = useState({
      ordem: 'novo',
      tipo: '', // '' = todos, '1' = receita, '0' = gasto
      created_by: ''
  });
  const filterRef = useRef<HTMLDivElement>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState<Categoria | null>(null);
  const [categoriaToView, setCategoriaToView] = useState<CategoriaComDetalhes | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
      fetch('http://127.0.0.1:8000/api/usuarios', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => res.json())
      .then(data => setUsuarios(data));
  }, []);

  const fetchCategorias = async () => {
    setIsLoading(true);
    try {
      const data: any[] = await CategoriaService.fetchCategorias({
          ...filters,
          search: searchTerm
      });
      
      const categoriasComDetalhes: CategoriaComDetalhes[] = data.map((cat) => ({
        ...cat,
        created_at: cat.created_at,
        created_by_user_name: cat.usuario ? cat.usuario.nome_usuario : 'Usuário não informado', 
        descricao: cat.descricao || null
      }));

      setCategorias(categoriasComDetalhes);
    } catch (err) {
      setError('Erro ao carregar as categorias.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
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

  const handleNovaCategoriaClick = () => { setCategoriaToEdit(null); setIsFormModalOpen(true); };
  const handleEditarClick = (categoria: Categoria) => { setCategoriaToEdit(categoria); setIsFormModalOpen(true); };
  const handleDetalhesClick = (categoria: CategoriaComDetalhes) => { setCategoriaToView(categoria); setIsDetailsModalOpen(true); };
  const handleCloseFormModal = () => { setIsFormModalOpen(false); setCategoriaToEdit(null); };
  const handleCloseDetailsModal = () => { setIsDetailsModalOpen(false); setCategoriaToView(null); };
  const handleCategoriaSaved = () => {
    fetchCategorias();
    setSuccessMessage('Categoria salva!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="categorias-container">
      {successMessage && <div className="success-popup">{successMessage}</div>}
      <div className="categorias-header-row">
        <h1>Lista de Categorias</h1>
        <button className="btn-nova-categoria" onClick={handleNovaCategoriaClick}>Nova Categoria</button>
      </div>

      <div className="search-controls-row">
        <div className="search-bar-wrapper">
            <div className="active-filters">
                {filters.tipo && (
                    <span className="filter-chip">
                        {filters.tipo === '1' ? 'Receita' : 'Gasto'} <span className="chip-remove" onClick={() => removeFilter('tipo')}>x</span>
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

            <input type="text" placeholder="Pesquisar categoria..." className="search-input-nofix" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

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
                            <h3>Tipo</h3>
                            <label><input type="radio" name="tipo" checked={filters.tipo === ''} onChange={() => setFilters({...filters, tipo: ''})} /> Todos</label>
                            <label><input type="radio" name="tipo" checked={filters.tipo === '1'} onChange={() => setFilters({...filters, tipo: '1'})} /> Receita</label>
                            <label><input type="radio" name="tipo" checked={filters.tipo === '0'} onChange={() => setFilters({...filters, tipo: '0'})} /> Gasto</label>
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
        <button className="btn-refresh" onClick={fetchCategorias}>
          <img src={refreshIcon} alt="Atualizar" />
        </button>
      </div>

      <div className="categorias-table-wrapper">
        <table className="categorias-table">
          <thead>
            <tr><th>Nome</th><th>Tipo</th><th>Detalhes</th><th>Editar</th></tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id_categoria}>
                <td>{cat.nome_categoria}</td>
                <td><span className={cat.tipo === 1 ? 'tipo-receita' : 'tipo-gasto'}>{cat.tipo === 1 ? 'Receita' : 'Gasto'}</span></td>
                <td><button className="btn-detalhes" onClick={() => handleDetalhesClick(cat)}>Detalhes</button></td>
                <td className="categorias-options"><button className="btn-editar" onClick={() => handleEditarClick(cat)}><img src={editarIcon} alt="Editar" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <CategoriasFormModal isOpen={isFormModalOpen} onClose={handleCloseFormModal} onCategoriaSaved={handleCategoriaSaved} categoriaToEdit={categoriaToEdit} />
      <CategoriasDetailsModal isOpen={isDetailsModalOpen} onClose={handleCloseDetailsModal} categoria={categoriaToView} />
    </div>
  );
};

export default CategoriasPage;