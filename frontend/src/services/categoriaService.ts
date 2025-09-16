import { AuthService } from './auth';

export interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  descricao?: string |null; // O ? torna o campo opcional
  created_at: string; // Adicione este campo para a data de criação
  created_by_user_name: string; // Adicione este campo para o nome do usuário
  tipo: 0 | 1;
}

export const CategoriaService = {
  async fetchCategorias(): Promise<Categoria[]> {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error('Token de autenticação não encontrado.');
      const response = await fetch('http://127.0.0.1:8000/api/categorias', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falha ao buscar categorias.');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  },

  async createCategoria(categoriaData: { nome_categoria: string; descricao: string | null; tipo: number }): Promise<Categoria> {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error('Token de autenticação não encontrado.');
      const response = await fetch('http://127.0.0.1:8000/api/categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoriaData),
      });
      if (!response.ok) throw new Error('Falha ao criar categoria.');
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  },

  async updateCategoria(id: number, categoriaData: { nome_categoria: string; descricao: string | null; tipo: number }): Promise<Categoria> {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error('Token de autenticação não encontrado.');
      const response = await fetch(`http://127.0.0.1:8000/api/categorias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(categoriaData),
      });
      if (!response.ok) throw new Error('Falha ao atualizar categoria.');
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  },

  async deleteCategoria(id: number): Promise<void> {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error('Token de autenticação não encontrado.');
      const response = await fetch(`http://127.0.0.1:8000/api/categorias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao excluir categoria.');
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      throw error;
    }
  },
};