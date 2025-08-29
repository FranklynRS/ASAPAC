export interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
  nbf: number;
  jti: string;
  iss: string;
}

export class TokenUtils {
  static decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  static getTokenExpirationTime(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded) return null;

    return new Date(decoded.exp * 1000);
  }

  static isTokenValid(token: string): boolean {
    if (!token) return false;
    
    const decoded = this.decodeToken(token);
    if (!decoded) return false;

    return !this.isTokenExpired(token);
  }

  static getTimeUntilExpiration(token: string): number {
    const decoded = this.decodeToken(token);
    if (!decoded) return 0;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - currentTime;
    
    return Math.max(0, timeLeft);
  }

  static shouldRefreshToken(token: string, refreshThreshold: number = 300): boolean {
    const timeLeft = this.getTimeUntilExpiration(token);
    return timeLeft > 0 && timeLeft < refreshThreshold;
  }

  static clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('refreshToken');
  }

  static setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('token');
  }
}