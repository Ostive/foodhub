'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'react-hot-toast';

export function useOrderSubmission() {
  const router = useRouter();
  const { cart = [], clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Calculate total
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  const submitOrder = async (deliveryAddress: string, paymentMethod: string) => {
    if (!deliveryAddress) {
      setOrderError('Please provide a delivery address');
      toast.error('Please provide a delivery address');
      return;
    }

    if (!paymentMethod) {
      setOrderError('Please select a payment method');
      toast.error('Please select a payment method');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    try {
      // Get auth token if authenticated
      let authToken = '';
      if (isAuthenticated) {
        const cookies = document.cookie.split(';');
        const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
        authToken = authTokenCookie ? authTokenCookie.split('=')[1] : '';
      }

      // Get current timestamp for order time
      const currentTime = new Date().toISOString();
      
      // Prepare order data in the expected format
      const orderData = {
        customerId: isAuthenticated , // Replace with actual customer ID from auth context if available
        restaurantId: cart[0]?.restaurantId || 214, // Get restaurant ID from first cart item or use default
        deliveryLocalisation: deliveryAddress,
        time: currentTime,
        cost: subtotal,
        deliveryFee: deliveryFee,
        status: "created",
        dishes: cart.map(item => ({
          dishId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      // Detailed logging of order request body
      console.log('%c Order Request Body:', 'background: #34D399; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;');
      console.log(JSON.stringify(orderData, null, 2));
      console.log('%c Headers:', 'background: #34D399; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;');
      console.log(JSON.stringify({
        'Content-Type': 'application/json',
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
      }, null, 2));
      // Use the correct API URL from environment variables
      const apiUrl = `${process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:3001'}/api/orders/`;
      console.log('%c API URL:', 'background: #34D399; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;');
      console.log(apiUrl);

      // Submit order to API
      const requestBody = JSON.stringify(orderData);
      console.log('%c Raw Request Body:', 'background: #34D399; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;');
      console.log(requestBody);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: requestBody
      });

      if (!response.ok) {
        throw new Error(`Failed to place order: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Order placed successfully:', result);

      // Show success message
      toast.success('Order placed successfully!');

      // Clear cart
      clearCart();
      
      // Ensure cart is cleared in localStorage before redirecting
      localStorage.setItem('foodhub-cart', JSON.stringify([]));
      
      // Small delay to ensure localStorage is updated before redirect
      setTimeout(() => {
        // Redirect to order tracking page
        if (result && result.orderId) {
          router.push(`/customer/order-tracking/${result.orderId}`);
        } else {
          router.push('/customer/orders');
        }
      }, 100);
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderError('Failed to place your order. Please try again.');
      toast.error('Failed to place your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    orderError,
    subtotal,
    deliveryFee,
    total,
    submitOrder
  };
}
