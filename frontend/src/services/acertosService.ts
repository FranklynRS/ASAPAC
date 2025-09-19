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
  id_lancamento: number | string;
  descricao: string;
  valor: number;
  categoria: Categoria;
}

export interface AcertoData {
  id_mensageiro: number;
  valor_recebido: number;
  pagamento: number;
  gasolina: number;
  hotel: number;
  alimentacao: number;
  outros: number;
  id_usuario?: number;
  id_mes: number;
}

export interface Acerto {
  id_acerto: number;
  id_mensageiro: number;
  nome_mensageiro: string;
  valor_recebido: number;
  pagamento: number;
  gasolina: number;
  hotel: number;
  alimentacao: number;
  outros: number;
}

export interface LancamentoData {
  valor: number;
  descricao: string;
  tipo: 0 | 1;
  id_mes: number;
  id_usuario: number;
  id_categoria: number;
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

  async fetchAcertosByMes(idMes: number): Promise<Acerto[]> {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error('Token de autenticação não encontrado.');
      const response = await fetch(`http://127.0.0.1:8000/api/acertos/mes/${idMes}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao buscar os acertos.');
      
      const data = await response.json();
      return data.map((acerto: Acerto) => ({
          ...acerto,
          valor_recebido: Number(acerto.valor_recebido),
          pagamento: Number(acerto.pagamento),
          gasolina: Number(acerto.gasolina),
          hotel: Number(acerto.hotel),
          alimentacao: Number(acerto.alimentacao),
          outros: Number(acerto.outros),
      }));
    } catch (error) {
      console.error('Erro ao buscar acertos:', error);
      throw error;
    }
  },

  async fetchCombinedByMes(idMes: number): Promise<Lancamento[]> {
      try {
          const token = AuthService.getToken();
          if (!token) throw new Error('Token de autenticação não encontrado.');
          const response = await fetch(`http://127.0.0.1:8000/api/lancamentos-combinados/${idMes}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
          });
          if (!response.ok) throw new Error('Falha ao buscar os lançamentos.');
          return await response.json();
      } catch (error) {
          console.error('Erro ao buscar lançamentos combinados:', error);
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
  
  // Novas funções para CRUD de Acertos
  async updateAcerto(id: number, acertoData: Partial<AcertoData>): Promise<any> {
    try {
        const token = AuthService.getToken();
        if (!token) throw new Error('Token de autenticação não encontrado.');
        const response = await fetch(`http://127.0.0.1:8000/api/acertos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(acertoData),
        });
        if (!response.ok) throw new Error('Falha ao atualizar acerto.');
        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar acerto:', error);
        throw error;
    }
  },

  async deleteAcerto(id: number): Promise<void> {
      try {
          const token = AuthService.getToken();
          if (!token) throw new Error('Token de autenticação não encontrado.');
          const response = await fetch(`http://127.0.0.1:8000/api/acertos/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Falha ao excluir acerto.');
      } catch (error) {
          console.error('Erro ao excluir acerto:', error);
          throw error;
      }
  },
  
  // Novas funções para CRUD de Lançamentos
  async updateLancamento(id: number | string, lancamentoData: Partial<LancamentoData>): Promise<any> {
      try {
          const token = AuthService.getToken();
          if (!token) throw new Error('Token de autenticação não encontrado.');
          const response = await fetch(`http://127.0.0.1:8000/api/lancamentos/${id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(lancamentoData),
          });
          if (!response.ok) throw new Error('Falha ao atualizar lançamento.');
          return await response.json();
      } catch (error) {
          console.error('Erro ao atualizar lançamento:', error);
          throw error;
      }
  },

  async deleteLancamento(id: number | string): Promise<void> {
      try {
          const token = AuthService.getToken();
          if (!token) throw new Error('Token de autenticação não encontrado.');
          const response = await fetch(`http://127.0.0.1:8000/api/lancamentos/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Falha ao excluir lançamento.');
      } catch (error) {
          console.error('Erro ao excluir lançamento:', error);
          throw error;
      }
  },

  async createLancamento(lancamentoData: LancamentoData): Promise<any> {
    try {
      const token = AuthService.getToken();
      if (!token) throw new Error('Token de autenticação não encontrado.');
      const response = await fetch('http://127.0.0.1:8000/api/lancamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(lancamentoData),
      });
      if (!response.ok) throw new Error('Falha ao registrar lançamento.');
      return await response.json();
    } catch (error) {
      console.error('Erro ao registrar lançamento:', error);
      throw error;
    }
  },
};