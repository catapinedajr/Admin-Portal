import NetInfo from '@react-native-community/netinfo';
import { authStorage } from './storage';

const API_BASE_URL = 'https://hodlearnbeta.replit.app';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Check network connectivity
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        return {
          error: 'No internet connection',
          status: 0
        };
      }

      // Get auth token if available
      const token = await authStorage.getToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        timeout: 10000 // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        return {
          data,
          status: response.status
        };
      } else {
        return {
          error: `API Error: ${response.status}`,
          status: response.status
        };
      }
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  // Bitcoin price with error handling
  async getBitcoinPrice() {
    return this.get('/api/bitcoin-price');
  }

  // Wallet dashboard with error handling
  async getWalletDashboard() {
    return this.get('/api/wallet/dashboard');
  }

  // Day content with error handling
  async getDayMetadata(dayIndex: number) {
    return this.get(`/api/day-metadata/${dayIndex}`);
  }

  async getDailyFacts(dayIndex: number) {
    return this.get(`/api/daily-facts/${dayIndex}`);
  }
}

export const api = new ApiService();