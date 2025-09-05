import { AuthService } from './auth';

export interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  tipo: number; // 0 para gasto, 1 para recebimento
}

export interface Lancamento {
  id_lancamento: number;
  descricao: string;
  valor: number;
  categoria: Categoria;
}

export const AcertosService = {
  async fetchLancamentosByMes(idMes: number): Promise<Lancamento[]> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }
      
      const response = await fetch(`http://127.0.0.1:8000/api/lancamentos/mes/${idMes}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar os lançamentos.');
      }

      const lancamentos: Lancamento[] = await response.json();
      return lancamentos;
      
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error);
      throw error;
    }
  }
};
