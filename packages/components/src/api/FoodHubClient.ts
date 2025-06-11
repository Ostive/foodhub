/**
 * FoodHub API Client
 * A reusable client for interacting with FoodHub API services
 */

export interface FoodHubClientConfig {
  baseUrl: string;
  apiKey?: string;
  restaurantId?: string;
  timeout?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}

/**
 * FoodHub API Client for restaurant owners and third-party developers
 * 
 * @example
 * ```typescript
 * import { FoodHubClient } from '@foodhub/components';
 * 
 * const client = new FoodHubClient({
 *   baseUrl: 'https://api.foodhub.com',
 *   apiKey: 'your-api-key',
 *   restaurantId: 'your-restaurant-id'
 * });
 * 
 * // Get menu items
 * const menu = await client.getMenu();
 * 
 * // Update an item
 * await client.updateMenuItem('item-id', { price: 5.99 });
 * ```
 */
export class FoodHubClient {
  private baseUrl: string;
  private apiKey?: string;
  private restaurantId?: string;
  private timeout: number;

  constructor(config: FoodHubClientConfig) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.restaurantId = config.restaurantId;
    this.timeout = config.timeout || 30000; // Default 30 seconds
  }

  private async request<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const responseData = await response.json();
      
      return {
        data: responseData.data,
        status: response.status,
        message: responseData.message || '',
        success: response.ok,
      };
    } catch (error) {
      return {
        data: null as unknown as T,
        status: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      };
    }
  }

  /**
   * Get restaurant menu
   */
  async getMenu<T>(): Promise<ApiResponse<T>> {
    if (!this.restaurantId) {
      throw new Error('Restaurant ID is required to get menu');
    }
    return this.request<T>(`/restaurants/${this.restaurantId}/menu`);
  }

  /**
   * Update a menu item
   */
  async updateMenuItem<T>(itemId: string, data: any): Promise<ApiResponse<T>> {
    if (!this.restaurantId) {
      throw new Error('Restaurant ID is required to update menu item');
    }
    return this.request<T>(
      `/restaurants/${this.restaurantId}/menu/items/${itemId}`,
      'PUT',
      data
    );
  }

  /**
   * Get restaurant orders
   */
  async getOrders<T>(status?: 'pending' | 'processing' | 'completed' | 'cancelled'): Promise<ApiResponse<T>> {
    if (!this.restaurantId) {
      throw new Error('Restaurant ID is required to get orders');
    }
    
    const endpoint = status 
      ? `/restaurants/${this.restaurantId}/orders?status=${status}`
      : `/restaurants/${this.restaurantId}/orders`;
      
    return this.request<T>(endpoint);
  }

  /**
   * Update order status
   */
  async updateOrderStatus<T>(orderId: string, status: 'accepted' | 'rejected' | 'preparing' | 'ready' | 'completed'): Promise<ApiResponse<T>> {
    if (!this.restaurantId) {
      throw new Error('Restaurant ID is required to update order status');
    }
    
    return this.request<T>(
      `/restaurants/${this.restaurantId}/orders/${orderId}/status`,
      'PUT',
      { status }
    );
  }

  /**
   * Get restaurant analytics
   */
  async getAnalytics<T>(period: 'day' | 'week' | 'month' | 'year'): Promise<ApiResponse<T>> {
    if (!this.restaurantId) {
      throw new Error('Restaurant ID is required to get analytics');
    }
    
    return this.request<T>(`/restaurants/${this.restaurantId}/analytics?period=${period}`);
  }
}
