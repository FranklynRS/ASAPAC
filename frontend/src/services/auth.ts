import apiClient from './api';

export interface LoginData {
  email_usuario: string;
  senha_usuario: string;
}

export interface LoginResponse {
  message: string;
  usuario: {
    id_usuario: number;
    nome_usuario: string;
    email_usuario: string;
  };
  token: string;
}

export interface RegisterData {
  nome_usuario: string;
  email_usuario: string;
  senha_usuario: string;
}

export class AuthService {
  static async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/usuarios/login', data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    }
  }

  static async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/usuarios', data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      }
      
      return response.data;
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat();
        throw new Error(errorMessages.join(', '));
      }
      throw new Error(error.response?.data?.message || 'Erro ao cadastrar usuário');
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post('/usuarios/logout');
    } catch (error) {
      console.warn('Erro ao fazer logout na API:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  }

  static async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post('/usuarios/refresh');
      const newToken = response.data.token;
      
      localStorage.setItem('token', newToken);
      return newToken;
    } catch (error: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      throw new Error('Sessão expirada. Faça login novamente.');
    }
  }

  static async getProfile(): Promise<any> {
    try {
      const response = await apiClient.get('/usuarios/me');
      return response.data;
    } catch (error: any) {
      throw new Error('Erro ao buscar dados do usuário');
    }
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem('usuario');
    return userStr ? JSON.parse(userStr) : null;
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  static getUserIdFromToken(): number | null {
    try {
      const token = this.getToken();
      if (!token) {
        return null;
      }

      const payloadBase64 = token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);

      return payload.sub || null;
    } catch (e) {
      console.error("Erro ao decodificar token:", e);
      return null;
    }
  }
}