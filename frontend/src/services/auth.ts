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
    foto_usuario?: string;
  };
  token: string;
}

export interface RegisterData {
  nome_usuario: string;
  email_usuario: string;
  senha_usuario: string;
}

export class AuthService {
  
  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static setToken(token: string) {
    localStorage.setItem('token', token);
  }

  static getUser() {
    return this.getCurrentUser();
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem('usuario'); 
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }
    return null;
  }

  static setUser(user: any) {
    localStorage.setItem('usuario', JSON.stringify(user));
  }

  static getUserIdFromToken(): number | null {
    try {
      const user = this.getCurrentUser();
      if (user && user.id_usuario) {
        return user.id_usuario;
      }
      
      const token = this.getToken();
      if (!token) return null;

      const payloadBase64 = token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      const payload = JSON.parse(decodedPayload);

      return payload.sub || payload.id_usuario || null;
    } catch (e) {
      console.error("Erro ao obter ID do usuário:", e);
      return null;
    }
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  static async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/usuarios/login', data);
      
      if (response.data.token) {
        this.setToken(response.data.token);
        this.setUser(response.data.usuario);
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
        this.setToken(response.data.token);
        this.setUser(response.data.usuario);
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
      console.warn('Logout API warning:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  }

  static async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post('/usuarios/refresh');
      const newToken = response.data.token;
      this.setToken(newToken);
      return newToken;
    } catch (error: any) {
      this.logout();
      throw new Error('Sessão expirada.');
    }
  }
}