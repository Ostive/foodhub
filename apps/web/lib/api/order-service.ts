import { Cart, CartItem, OrderDetails, OrderStatus } from './types';
import { clearCart, getCart } from './cart_storage';

// Generate a random 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Calculate total price from cart items
function calculateTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + (parseFloat(item.price) * item.quantity);
  }, 0);
}

// Submit an order from the cart
export async function submitOrder(
  customerId: number, 
  deliveryAddress: string, 
  deliveryInstructions?: string
): Promise<OrderDetails | null> {
  try {
    const cart = getCart();
    
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Get restaurant ID from the first item (all items should be from the same restaurant)
    const restaurantId = parseInt(cart[0].restaurantId);
    
    // Create order object
    const orderData = {
      customerId,
      restaurantId,
      deliveryLocalisation: deliveryAddress,
      items: cart,
      deliveryAddress: deliveryAddress,
      specialInstructions: deliveryInstructions
    };
    
    // Submit to API
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error(`Error creating order: ${response.statusText}`);
    }
    
    const orderResponse = await response.json();
    
    // Generate verification code and store it with the order
    const verificationCode = generateVerificationCode();
    
    // Create full order details
    const orderDetails: OrderDetails = {
      orderId: orderResponse.orderId,
      items: cart,
      customerId,
      restaurantId,
      deliveryAddress,
      deliveryInstructions,
      status: OrderStatus.CREATED,
      total: calculateTotal(cart),
      time: new Date(),
      verificationCode
    };
    
    // Save order to local storage for tracking
    saveOrderToLocalStorage(orderDetails);
    
    // Clear the cart after successful order
    clearCart();
    
    return orderDetails;
  } catch (error) {
    console.error('Error submitting order:', error);
    return null;
  }
}

// Save order to local storage for tracking
function saveOrderToLocalStorage(order: OrderDetails): void {
  if (typeof window === 'undefined') return;
  
  // Get existing orders
  const ordersStr = localStorage.getItem('user_orders');
  const orders: OrderDetails[] = ordersStr ? JSON.parse(ordersStr) : [];
  
  // Add new order
  orders.push(order);
  
  // Save back to local storage
  localStorage.setItem('user_orders', JSON.stringify(orders));
}

// Get all orders for the current user
export function getUserOrders(): OrderDetails[] {
  if (typeof window === 'undefined') return [];
  
  const ordersStr = localStorage.getItem('user_orders');
  return ordersStr ? JSON.parse(ordersStr) : [];
}

// Get a specific order by ID
export function getOrderById(orderId: number): OrderDetails | null {
  const orders = getUserOrders();
  return orders.find(order => order.orderId === orderId) || null;
}

// Update order status
export async function updateOrderStatus(orderId: number, status: OrderStatus): Promise<boolean> {
  try {
    // Update on the server
    const response = await fetch(`/api/order/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating order status: ${response.statusText}`);
    }
    
    // Update in local storage
    const orders = getUserOrders();
    const orderIndex = orders.findIndex(order => order.orderId === orderId);
    
    if (orderIndex >= 0) {
      orders[orderIndex].status = status;
      localStorage.setItem('user_orders', JSON.stringify(orders));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

// Verify delivery code
export function verifyDeliveryCode(orderId: number, code: string): boolean {
  const order = getOrderById(orderId);
  
  if (!order || !order.verificationCode) {
    return false;
  }
  
  return order.verificationCode === code;
}
