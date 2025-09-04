import { AuthService } from './auth';

interface MesComSaldo {
  id: number;
  nome: string;
  valor: number;
  status: 'positivo' | 'negativo';
}

export const MesesService = {
  async cadastrarMes(mesAno: string): Promise<void> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const response = await fetch('http://127.0.0.1:8000/api/meses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ "ano_mes": mesAno }),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar mês.');
      }

      console.log('Mês cadastrado com sucesso!');
    } catch (err) {
      console.error(err);
      throw err; // ou trate o erro de outra forma
    }
  },

  async fetchMesesComSaldos(): Promise<MesComSaldo[]> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const response = await fetch('http://127.0.0.1:8000/api/meses-com-saldos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar os meses.');
      }

      const data = await response.json();
      
      const mesesDoAno = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

      return data.map((mes: any) => {
          const [ano, mesNumero] = mes.ano_mes.split('-');
          const nomeDoMes = mesesDoAno[parseInt(mesNumero, 10) - 1];
          return {
              id: mes.id_mes,
              nome: `${nomeDoMes}/${ano}`,
              valor: mes.saldo,
              status: mes.status,
          };
      });

    } catch (error) {
      console.error('Erro ao buscar meses:', error);
      throw error;
    }
  }
};
