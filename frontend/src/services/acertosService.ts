import { AuthService } from './auth';

export interface Mensageiro {
  id_mensageiro: number;
  nome_mensageiro: string;
  codigo_mensageiro: string;
}

export interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  descricao: string;
  tipo: 0 | 1; // 0 para Pagamento, 1 para Recebimento
}

export interface Lancamento {
  id_lancamento: number;
  descricao: string;
  valor: number;
  categoria: Categoria;
}

export interface AcertoData {
  id_mensageiro: number;
  valor_recebido: number;
  pagamento: number;
  // A lógica de categorias será tratada no frontend
  categorias: Array<{ id_categoria: number; valor: number }>;
}

export const AcertosService = {
  async fetchMensageiros(): Promise<Mensageiro[]> {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error('Token de autenticação não encontrado.');
      const response = await fetch('http://127.0.0.1:8000/api/mensageiros', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falha ao buscar mensageiros.');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar mensageiros:', error);
      throw error;
    }
  },

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
  
  async fetchLancamentosByMes(idMes: number): Promise<Lancamento[]> {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error('Token de autenticação não encontrado.');
      const response = await fetch(`http://127.0.0.1:8000/api/lancamentos/mes/${idMes}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Falha ao buscar os lançamentos.');
      return await response.json();
      
    } catch (error) {
      console.error('Erro ao buscar lançamentos:', error);
      throw error;
    }
  },

  async createAcerto(acertosData: AcertoData): Promise<any> {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error('Token de autenticação não encontrado.');
      const response = await fetch('http://127.0.0.1:8000/api/acertos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(acertosData),
      });
      if (!response.ok) throw new Error('Falha ao registrar acerto.');
      return await response.json();
    } catch (error) {
      console.error('Erro ao registrar acerto:', error);
      throw error;
    }
  },
};