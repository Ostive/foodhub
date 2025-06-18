import { useState, useEffect, useCallback } from 'react';
import { OrderDetails, OrderStatus } from '../lib/api/types';

/**
 * Hook for restaurants to poll for new orders and manage them
 * @param restaurantId The ID of the restaurant
 * @param pollingInterval Interval in milliseconds to check for new orders (default: 10000ms = 10s)
 */
export function useRestaurantOrders(restaurantId: number, pollingInterval = 10000) {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from the API
  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch(`/api/restaurant/${restaurantId}/orders`);
      
      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`);
      }
      
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching restaurant orders:', err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  // Accept an order
  const acceptOrder = useCallback(async (orderId: number) => {
    try {
      const response = await fetch(`/api/order/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: OrderStatus.ACCEPTED_RESTAURANT }),
      });
      
      if (!response.ok) {
        throw new Error(`Error accepting order: ${response.statusText}`);
      }
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: OrderStatus.ACCEPTED_RESTAURANT } 
            : order
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error accepting order:', err);
      return false;
    }
  }, []);

  // Set order to preparing
  const setOrderToPreparing = useCallback(async (orderId: number) => {
    try {
      const response = await fetch(`/api/order/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: OrderStatus.PREPARING }),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating order status: ${response.statusText}`);
      }
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: OrderStatus.PREPARING } 
            : order
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error setting order to preparing:', err);
      return false;
    }
  }, []);

  // Poll for orders
  useEffect(() => {
    // Initial fetch
    fetchOrders();
    
    // Set up polling interval
    const intervalId = setInterval(fetchOrders, pollingInterval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchOrders, pollingInterval]);

  return {
    orders,
    loading,
    error,
    acceptOrder,
    setOrderToPreparing,
    refreshOrders: fetchOrders
  };
}
