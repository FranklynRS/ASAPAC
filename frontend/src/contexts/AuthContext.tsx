import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService, LoginData, RegisterData } from '../services/auth';
import { TokenUtils } from '../utils/token';

interface User {
  id_usuario: number;
  nome_usuario: string;
  email_usuario: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const token = AuthService.getToken();
      const storedUser = AuthService.getCurrentUser();

      if (token && storedUser) {
        if (TokenUtils.isTokenValid(token)) {
          setUser(storedUser);
          
          if (TokenUtils.shouldRefreshToken(token)) {
            await AuthService.refreshToken();
          }
        } else {
          await logout();
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(data);
      setUser(response.usuario);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.register(data);
      setUser(response.usuario);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      await AuthService.refreshToken();
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};