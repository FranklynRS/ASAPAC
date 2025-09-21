import React, { useState, useEffect } from 'react';
import './CategoriasPage.scss';
import { CategoriaService, Categoria } from '../services/categoriaService';
import CategoriasFormModal from '../pages/CategoriasFormModal';
import CategoriasDetailsModal from '../pages/CategoriasDetailsModal';
import editarIcon from '../assets/editar.png';
import excluirIcon from '../assets/excluir.png';
import refreshIcon from '../assets/refresh.png';

interface CategoriaComDetalhes extends Categoria {
  created_at: string;
  created_by_user_name: string;
  descricao: string | null;
  
}

const CategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = useState<CategoriaComDetalhes[]>([]);
  const [todasCategorias, setTodasCategorias] = useState<CategoriaComDetalhes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState<Categoria | null>(null);
  const [categoriaToView, setCategoriaToView] = useState<CategoriaComDetalhes | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

const fetchCategorias = async () => {
    setIsLoading(true);
    try {
      const data: Categoria[] = await CategoriaService.fetchCategorias();
      
      const categoriasComDetalhes: CategoriaComDetalhes[] = data.map((cat: Categoria) => ({
        ...cat,
        created_at: cat.created_at,
        created_by_user_name: cat.created_by_user_name, 
        descricao: cat.descricao || null
      }));

      setTodasCategorias(categoriasComDetalhes);
      setCategorias(categoriasComDetalhes);
    } catch (err) {
      setError('Erro ao carregar as categorias. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
};

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    const filteredData = todasCategorias.filter((cat) =>
      cat.nome_categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCategorias(filteredData);
  }, [searchTerm, todasCategorias]);

  const handleNovaCategoriaClick = () => {
    setCategoriaToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditarClick = (categoria: Categoria) => {
    setCategoriaToEdit(categoria);
    setIsFormModalOpen(true);
  };

  const handleDetalhesClick = (categoria: CategoriaComDetalhes) => {
    setCategoriaToView(categoria);
    setIsDetailsModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setCategoriaToEdit(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setCategoriaToView(null);
  };

  const handleCategoriaSaved = () => {
    fetchCategorias();
  };

  const handleExcluirClick = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await CategoriaService.deleteCategoria(id);
        fetchCategorias();
      } catch (err) {
        setError('Erro ao excluir categoria.');
        console.error(err);
      }
    }
  };
  
  if (isLoading) {
    return <div className="categorias-container">Carregando categorias...</div>;
  }

  if (error) {
    return <div className="categorias-container error-message">{error}</div>;
  }
  
  return (
    <div className="categorias-container">
      <div className="categorias-header-row">
        <h1>Lista de Categorias</h1>
        <button className="btn-nova-categoria" onClick={handleNovaCategoriaClick}>Nova Categoria</button>
      </div>

      <div className="search-controls-row">
        <input
          type="text"
          placeholder="Pesquisar categoria..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-refresh" onClick={fetchCategorias}>
          <img src={refreshIcon} alt="Atualizar" />
        </button>
      </div>

      <div className="categorias-table-wrapper">
        <table className="categorias-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Detalhes</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id_categoria}>
                <td>{categoria.nome_categoria}</td>
                <td>
                  <span className={categoria.tipo === 1 ? 'tipo-receita' : 'tipo-gasto'}>
                    {categoria.tipo === 1 ? 'Receita' : 'Gasto'}
                  </span>
                </td>
                <td>
                  <button className="btn-detalhes" onClick={() => handleDetalhesClick(categoria)}>
                    Detalhes
                  </button>
                </td>
                <td className="categorias-options">
                  <button className="btn-editar" onClick={() => handleEditarClick(categoria)}>
                    <img src={editarIcon} alt="Editar" />
                  </button>
                  <button className="btn-excluir" onClick={() => handleExcluirClick(categoria.id_categoria)}>
                    <img src={excluirIcon} alt="Excluir" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CategoriasFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onCategoriaSaved={handleCategoriaSaved}
        categoriaToEdit={categoriaToEdit}
      />

      <CategoriasDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        categoria={categoriaToView}
      />
    </div>
  );
};

export default CategoriasPage;