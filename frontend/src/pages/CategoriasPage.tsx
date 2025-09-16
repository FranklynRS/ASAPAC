import React, { useState, useEffect } from 'react';
import './CategoriasPage.scss';
import { CategoriaService, Categoria } from '../services/categoriaService';
import CategoriasFormModal from '../pages/CategoriasFormModal';
import editarIcon from '../assets/editar.png';
import excluirIcon from '../assets/excluir.png';

const CategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaToEdit, setCategoriaToEdit] = useState<Categoria | null>(null);

  const fetchCategorias = async () => {
    setIsLoading(true);
    try {
      const data = await CategoriaService.fetchCategorias();
      setCategorias(data);
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

  const handleNovaCategoriaClick = () => {
    setCategoriaToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditarClick = (categoria: Categoria) => {
    setCategoriaToEdit(categoria);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoriaToEdit(null);
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
      <div className="categorias-header">
        <h1>Lista de Categorias</h1>
        <button className="btn-nova-categoria" onClick={handleNovaCategoriaClick}>Nova Categoria</button>
      </div>

      <div className="categorias-table-wrapper">
        <table className="categorias-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id_categoria}>
                <td>{categoria.nome_categoria}</td>
                <td>{categoria.descricao}</td>
                <td>{categoria.tipo === 1 ? 'Receita' : 'Gasto'}</td>
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCategoriaSaved={handleCategoriaSaved}
        categoriaToEdit={categoriaToEdit}
      />
    </div>
  );
};

export default CategoriasPage;