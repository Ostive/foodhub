/**
 * Orders API client for interacting with the order service
 */

import { apiRequest } from './api-client';
import { clearCart, getCart } from './cart_storage';

// Base service
const SERVICE = 'order';

// Types for API requests and responses
export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED_BY_RESTAURANT = 'accepted_by_restaurant',
  ACCEPTED_BY_DELIVERY = 'accepted_by_delivery',
  PREPARING = 'preparing',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export type OrderItem = {
  id: number;
  orderId: number;
  dishId?: number;
  menuId?: number;
  quantity: number;
  price: number;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: number;
  customerId: number;
  restaurantId: number;
  deliveryPersonId?: number;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  deliveryFee: number;
  estimatedDeliveryTime?: string;
  deliveryCode?: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
};

// Import types from types.ts
import { CartItem, Cart } from './types';

export type CreateOrderDto = {
  customerId: number;
  restaurantId: number;
  deliveryAddress: string;
  paymentMethod: string;
  specialInstructions?: string;
  items: {
    dishId?: number;
    menuId?: number;
    quantity: number;
    specialInstructions?: string;
  }[];
};

export type UpdateOrderDto = Partial<Omit<CreateOrderDto, 'items'>>;

export type VerifyDeliveryCodeDto = {
  deliveryCode: string;
};

// Orders API functions
// Order details type for frontend use

export type OrderDetails = {
  orderId: number;
  items: CartItem[];
  customerId: number;
  restaurantId: number;
  deliveryAddress: string;
  deliveryInstructions?: string;
  status: OrderStatus;
  total: number;
  time: Date;
  verificationCode?: string;
};

export const ordersApi = {
  // Get welcome message
  getHello: () => apiRequest<{ message: string }>(SERVICE, 'orders/hello'),
  
  // Get all orders
  getAll: () => apiRequest<Order[]>(SERVICE, 'orders'),
  
  // Get order by ID
  getById: (id: number) => apiRequest<Order>(SERVICE, `orders/${id}`),
  
  // Get order with items
  getWithItems: (id: number) => apiRequest<Order>(SERVICE, `orders/${id}/items`),
  
  // Create a new order
  create: (orderData: CreateOrderDto) => apiRequest<Order>(SERVICE, 'orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  // Update an order
  update: (id: number, orderData: UpdateOrderDto) => apiRequest<Order>(SERVICE, `orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),
  
  // Get orders by status
  getByStatus: (status: OrderStatus) => apiRequest<Order[]>(SERVICE, `orders/status/${status}`),
  
  // Get orders for a delivery person
  getByDeliveryPerson: (deliveryPersonId: number) => apiRequest<Order[]>(SERVICE, `orders/delivery-person/${deliveryPersonId}`),
  
  // Get orders available for delivery
  getAvailableForDelivery: () => apiRequest<Order[]>(SERVICE, 'orders/available-for-delivery'),
  
  // Order status updates
  status: {
    // Accept order by restaurant
    acceptByRestaurant: (id: number) => apiRequest<Order>(SERVICE, `orders/${id}/accept-restaurant`, {
      method: 'PATCH',
    }),
    
    // Accept order by delivery person
    acceptByDelivery: (id: number) => apiRequest<Order>(SERVICE, `orders/${id}/accept-delivery`, {
      method: 'PATCH',
    }),
    
    // Set order to preparing
    setPreparing: (id: number) => apiRequest<Order>(SERVICE, `orders/${id}/preparing`, {
      method: 'PATCH',
    }),
    
    // Set order to out for delivery
    setOutForDelivery: (id: number) => apiRequest<Order>(SERVICE, `orders/${id}/out-for-delivery`, {
      method: 'PATCH',
    }),
    
    // Set order to delivered
    setDelivered: (id: number) => apiRequest<Order>(SERVICE, `orders/${id}/delivered`, {
      method: 'PATCH',
    }),
    
    // Update order status with validation
    update: (id: number, status: OrderStatus) => apiRequest<Order>(SERVICE, `orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  },
  
  // Verify delivery code
  verifyDeliveryCode: (id: number, code: string) => apiRequest<{ verified: boolean }>(SERVICE, `orders/${id}/verify-code`, {
    method: 'POST',
    body: JSON.stringify({ deliveryCode: code }),
  }),
  
  // Submit an order from the cart
  submitOrderFromCart: async (customerId: number, deliveryAddress: string, paymentMethod: string, specialInstructions?: string) => {
    const cart = getCart();
    
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Get restaurant ID from the first item (all items should be from the same restaurant)
    const restaurantId = parseInt(cart[0].restaurantId);
    
    // Map cart items to order items format
    const orderItems = cart.map(item => ({
      // Use the item.id and item.type to determine if it's a dish or menu
      dishId: item.type === 'dish' ? parseInt(item.id) : undefined,
      menuId: item.type === 'menu' ? parseInt(item.id) : undefined,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions
    }));
    
    // Create order object
    const orderData: CreateOrderDto = {
      customerId,
      restaurantId,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      items: orderItems
    };
    
    // Submit to API - all calculations will be done on the backend
    const response = await apiRequest<Order>(SERVICE, 'orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    
    // Clear the cart after successful order
    clearCart();
    
    return response;
  },
  
  // Get user orders
  getUserOrders: (customerId: number) => apiRequest<Order[]>(SERVICE, `orders/customer/${customerId}`),
};
