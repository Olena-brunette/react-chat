import axios from 'axios';

const baseUrl = `${process.env.VITE_API_URL}/api`;

class AuthService {
  static getAccessToken(): string | null {
    return localStorage.getItem('at');
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem('rt');
  }

  static saveTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('at', accessToken);
    if (refreshToken) {
      localStorage.setItem('rt', refreshToken);
    }
  }

  static clearTokens(): void {
    localStorage.removeItem('at');
    localStorage.removeItem('rt');
  }

  static async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${baseUrl}/auth/refresh`, null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      const { token } = response.data;
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      this.saveTokens(token);

      return token;
    } catch (error) {
      this.clearTokens();
      window.location.href = '/login';
      throw error;
    }
  }
}

export default AuthService;
