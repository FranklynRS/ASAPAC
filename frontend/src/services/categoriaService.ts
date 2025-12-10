import { AuthService } from './auth';
import { API_BASE_URL } from './api';

export interface Categoria {
	id_categoria: number;
	nome_categoria: string;
	descricao?: string | null;
	created_at: string;
	created_by_user_name?: string;
	usuario?: { nome_usuario: string };
	tipo: 0 | 1;
}

export interface CategoriaFilters {
	search?: string;
	tipo?: string;
	created_by?: string;
	ordem?: string;
}

export const CategoriaService = {
	async fetchCategorias(filters?: CategoriaFilters): Promise<Categoria[]> {
		try {
			const token = AuthService.getToken();
			if (!token) throw new Error('Token de autenticação não encontrado.');

			const queryParams = new URLSearchParams();
			if (filters) {
				if (filters.search) queryParams.append('nome_categoria', filters.search);
				if (filters.tipo) queryParams.append('tipo', filters.tipo);
				if (filters.created_by) queryParams.append('created_by', filters.created_by);
				if (filters.ordem) queryParams.append('ordem', filters.ordem);
			}

			const response = await fetch(`${API_BASE_URL}/categorias?${queryParams.toString()}`, {
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

			const response = await fetch('${API_BASE_URL}/categorias', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify(categoriaData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Falha ao criar categoria.');
			}

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
			const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
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
			const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
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