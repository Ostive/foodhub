import { useState, useEffect, useCallback } from 'react';
import { FoodHubClient } from '../api/FoodHubClient';

export interface Order {
  id: string;
  restaurantId: string;
  customerId: string;
  items: OrderItem[];
  status: 'pending' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  estimatedReadyTime?: string;
  specialInstructions?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface OrderManagementOptions {
  client: FoodHubClient;
  pollingInterval?: number; // in milliseconds
  initialStatus?: 'pending' | 'processing' | 'completed' | 'cancelled';
}

/**
 * A React hook for restaurant owners to manage orders in real-time
 * 
 * @example
 * ```tsx
 * import { useOrderManagement, FoodHubClient } from '@foodhub/components';
 * 
 * function OrderDashboard() {
 *   const client = new FoodHubClient({
 *     baseUrl: 'https://api.foodhub.com',
 *     apiKey: 'your-api-key',
 *     restaurantId: 'your-restaurant-id'
 *   });
 *   
 *   const { 
 *     orders, 
 *     loading, 
 *     error, 
 *     updateOrderStatus,
 *     refreshOrders
 *   } = useOrderManagement({ client });
 *   
 *   return (
 *     <div>
 *       <h1>Orders</h1>
 *       {loading ? (
 *         <p>Loading orders...</p>
 *       ) : error ? (
 *         <p>Error: {error}</p>
 *       ) : (
 *         <ul>
 *           {orders.map(order => (
 *             <li key={order.id}>
 *               Order #{order.id} - {order.status}
 *               <button onClick={() => updateOrderStatus(order.id, 'accepted')}>
 *                 Accept
 *               </button>
 *             </li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOrderManagement(options: OrderManagementOptions) {
  const { client, pollingInterval = 30000, initialStatus = 'pending' } = options;
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(initialStatus);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await client.getOrders<Order[]>(status);
      
      if (response.success) {
        setOrders(response.data);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [client, status]);

  const updateOrderStatus = useCallback(async (
    orderId: string, 
    newStatus: 'accepted' | 'rejected' | 'preparing' | 'ready' | 'completed'
  ) => {
    try {
      const response = await client.updateOrderStatus(orderId, newStatus);
      
      if (response.success) {
        // Update the local state to reflect the change
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus } 
              : order
          )
        );
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
      return false;
    }
  }, [client]);

  const refreshOrders = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  const changeStatusFilter = useCallback((
    newStatus: 'pending' | 'processing' | 'completed' | 'cancelled'
  ) => {
    setStatus(newStatus);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Set up polling
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchOrders();
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [fetchOrders, pollingInterval]);

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refreshOrders,
    changeStatusFilter,
    currentStatus: status
  };
}
