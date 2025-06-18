import { useState, useEffect, useCallback } from 'react';
import { OrderDetails, OrderStatus } from '../lib/api/types';

/**
 * Hook for delivery persons to view available orders and manage their deliveries
 * @param deliveryPersonId The ID of the delivery person
 * @param pollingInterval Interval in milliseconds to check for new orders (default: 10000ms = 10s)
 */
export function useDeliveryPersonOrders(deliveryPersonId: number, pollingInterval = 10000) {
  const [assignedOrders, setAssignedOrders] = useState<OrderDetails[]>([]);
  const [availableOrders, setAvailableOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders assigned to this delivery person
  const fetchAssignedOrders = useCallback(async () => {
    try {
      const response = await fetch(`/api/delivery/${deliveryPersonId}/orders`);
      
      if (!response.ok) {
        throw new Error(`Error fetching assigned orders: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAssignedOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assigned orders');
      console.error('Error fetching assigned orders:', err);
    }
  }, [deliveryPersonId]);

  // Fetch orders available for delivery (accepted by restaurants but not yet assigned)
  const fetchAvailableOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/order/available-for-delivery');
      
      if (!response.ok) {
        throw new Error(`Error fetching available orders: ${response.statusText}`);
      }
      
      const data = await response.json();
      setAvailableOrders(data);
    } catch (err) {
      console.error('Error fetching available orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Accept an order for delivery
  const acceptOrder = useCallback(async (orderId: number) => {
    try {
      const response = await fetch(`/api/order/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: OrderStatus.ACCEPTED_DELIVERY,
          deliveryPersonId 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Error accepting order for delivery: ${response.statusText}`);
      }
      
      // Refresh both order lists
      await Promise.all([fetchAssignedOrders(), fetchAvailableOrders()]);
      return true;
    } catch (err) {
      console.error('Error accepting order for delivery:', err);
      return false;
    }
  }, [deliveryPersonId, fetchAssignedOrders, fetchAvailableOrders]);

  // Mark order as out for delivery
  const startDelivery = useCallback(async (orderId: number) => {
    try {
      const response = await fetch(`/api/order/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: OrderStatus.OUT_FOR_DELIVERY }),
      });
      
      if (!response.ok) {
        throw new Error(`Error starting delivery: ${response.statusText}`);
      }
      
      // Update local state
      setAssignedOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: OrderStatus.OUT_FOR_DELIVERY } 
            : order
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error starting delivery:', err);
      return false;
    }
  }, []);

  // Complete delivery with verification code
  const completeDelivery = useCallback(async (orderId: number, verificationCode: string) => {
    try {
      // First verify the code
      const verifyResponse = await fetch(`/api/order/${orderId}/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode }),
      });
      
      if (!verifyResponse.ok) {
        throw new Error('Invalid verification code');
      }
      
      // If code is valid, mark as delivered
      const response = await fetch(`/api/order/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: OrderStatus.DELIVERED }),
      });
      
      if (!response.ok) {
        throw new Error(`Error completing delivery: ${response.statusText}`);
      }
      
      // Update local state
      setAssignedOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId 
            ? { ...order, status: OrderStatus.DELIVERED } 
            : order
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error completing delivery:', err);
      return false;
    }
  }, []);

  // Poll for orders
  useEffect(() => {
    // Initial fetch
    const fetchAllOrders = async () => {
      await Promise.all([fetchAssignedOrders(), fetchAvailableOrders()]);
    };
    
    fetchAllOrders();
    
    // Set up polling interval
    const intervalId = setInterval(fetchAllOrders, pollingInterval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchAssignedOrders, fetchAvailableOrders, pollingInterval]);

  return {
    assignedOrders,
    availableOrders,
    loading,
    error,
    acceptOrder,
    startDelivery,
    completeDelivery,
    refreshOrders: async () => {
      await Promise.all([fetchAssignedOrders(), fetchAvailableOrders()]);
    }
  };
}
