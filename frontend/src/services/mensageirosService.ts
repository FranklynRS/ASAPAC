import { AuthService } from './auth';
import { API_BASE_URL } from './api';

export interface Mensageiro {
	id_mensageiro: number;
	nome_mensageiro: string;
	codigo_mensageiro: string;
	telefone: string;
	status: boolean;
	created_at: string;
}

export interface MensageiroFilters {
	search?: string;
	status?: string;
	created_by?: string;
	ordem?: string;
}

export const MensageirosService = {
	async fetchMensageiros(filters?: MensageiroFilters): Promise<Mensageiro[]> {
		try {
			const token = AuthService.getToken();
			if (!token) {
				throw new Error('Token de autenticação não encontrado.');
			}

			const queryParams = new URLSearchParams();
			if (filters) {
				if (filters.search) queryParams.append('nome_mensageiro', filters.search);
				if (filters.status) queryParams.append('status', filters.status);
				if (filters.created_by) queryParams.append('created_by', filters.created_by);
				if (filters.ordem) queryParams.append('ordem', filters.ordem);
			}

			const response = await fetch(`${API_BASE_URL}/mensageiros?${queryParams.toString()}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error('Falha ao buscar os mensageiros.');
			}

			const result = await response.json();
			return result;

		} catch (error) {
			console.error('Erro ao buscar mensageiros:', error);
			throw error;
		}
	},

	async createMensageiro(mensageiroData: { nome_mensageiro: string; codigo_mensageiro: string; telefone: string; status?: boolean }): Promise<Mensageiro> {
		try {
			const token = AuthService.getToken();
			if (!token) {
				throw new Error('Token de autenticação não encontrado.');
			}

			const response = await fetch('${API_BASE_URL}/mensageiros', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify(mensageiroData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Falha ao criar mensageiro.');
			}

			const result = await response.json();
			return result;

		} catch (error) {
			console.error('Erro ao criar mensageiro:', error);
			throw error;
		}
	},

	async updateMensageiro(id: number, mensageiroData: { nome_mensageiro: string; codigo_mensageiro: string; telefone: string; status?: boolean }): Promise<Mensageiro> {
		try {
			const token = AuthService.getToken();
			if (!token) {
				throw new Error('Token de autenticação não encontrado.');
			}

			const response = await fetch(`${API_BASE_URL}/mensageiros/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify(mensageiroData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Falha ao atualizar mensageiro.');
			}
			const result = await response.json();
			return result;

		} catch (error) {
			console.error('Erro ao atualizar mensageiro:', error);
			throw error;
		}
	},

	async deleteMensageiro(id: number): Promise<void> {
		try {
			const token = AuthService.getToken();
			if (!token) {
				throw new Error('Token de autenticação não encontrado.');
			}

			const response = await fetch(`${API_BASE_URL}/mensageiros/${id}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error('Falha ao excluir mensageiro.');
			}

		} catch (error) {
			console.error('Erro ao excluir mensageiro:', error);
			throw error;
		}
	}
};