import { AuthService } from './auth';

interface Lancamento {
  id_lancamento: number;
  id_mes: number;
  valor: number;
}

interface MesComSaldo {
  id: number;
  nome: string;
  valor: number;
  status: 'positivo' | 'negativo';
}

export const MesesService = {
  async fetchMesesComSaldo(): Promise<MesComSaldo[]> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }
      
      // Simulação da URL da sua API no backend Laravel
      const response = await fetch('http://127.0.0.1:8000/api/lancamentos', {
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

      // Mapeia o mês de id_mes para o nome do mês (ex: 1 -> Outubro/2025)
      const mesesMap = new Map<number, string>();
      // Você precisará de uma função para obter o nome do mês do backend ou construir localmente.
      // Exemplo:
      const mesesDoAno = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      
      const mesesComSaldo: MesComSaldo[] = [];
      const saldosPorMes = new Map<number, number>();

      lancamentos.forEach(lancamento => {
        const mesId = lancamento.id_mes;
        const saldoAtual = saldosPorMes.get(mesId) || 0;
        saldosPorMes.set(mesId, saldoAtual + lancamento.valor);
      });

      // Converte o mapa de saldos para o formato de array
      saldosPorMes.forEach((saldo, mesId) => {
        const nomeMes = mesesDoAno[(mesId - 1) % 12]; // Exemplo simples, pode precisar de ajuste
        const ano = 2025; // Exemplo
        mesesComSaldo.push({
          id: mesId,
          nome: `${nomeMes}/${ano}`,
          valor: saldo,
          status: saldo >= 0 ? 'positivo' : 'negativo',
        });
      });
      
      return mesesComSaldo;

    } catch (error) {
      console.error('Erro ao buscar meses:', error);
      throw error;
    }
  }
};