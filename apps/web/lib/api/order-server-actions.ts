/**
 * Server actions for order-related operations in Next.js Server Components
 */

import { serverApiRequest } from './server-api';
import { 
  Order, 
  OrderStatus, 
  CreateOrderDto, 
  UpdateOrderDto 
} from './orders-api';

// Base service
const SERVICE = 'order';

// Order server actions
export async function fetchOrders(options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<Order[]>(
    SERVICE,
    'orders',
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function fetchOrderById(id: number, options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<Order>(
    SERVICE,
    `orders/${id}`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function fetchOrderWithItems(id: number, options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<Order>(
    SERVICE,
    `orders/${id}/items`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function fetchOrdersByStatus(status: OrderStatus, options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<Order[]>(
    SERVICE,
    `orders/status/${status}`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function fetchOrdersByDeliveryPerson(deliveryPersonId: number, options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<Order[]>(
    SERVICE,
    `orders/delivery-person/${deliveryPersonId}`,
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function fetchOrdersAvailableForDelivery(options?: { cache?: RequestCache, revalidate?: number }) {
  return serverApiRequest<Order[]>(
    SERVICE,
    'orders/available-for-delivery',
    {
      cache: options?.cache,
      next: options?.revalidate !== undefined ? { revalidate: options.revalidate } : undefined
    }
  );
}

export async function createOrder(orderData: CreateOrderDto) {
  return serverApiRequest<Order>(
    SERVICE,
    'orders',
    {
      method: 'POST',
      body: JSON.stringify(orderData),
    }
  );
}

export async function updateOrder(id: number, orderData: UpdateOrderDto) {
  return serverApiRequest<Order>(
    SERVICE,
    `orders/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(orderData),
    }
  );
}

// Order status update actions
export async function acceptOrderByRestaurant(id: number) {
  return serverApiRequest<Order>(
    SERVICE,
    `orders/${id}/accept-restaurant`,
    {
      method: 'PATCH',
    }
  );
}

export async function acceptOrderByDelivery(id: number) {
  return serverApiRequest<Order>(
    SERVICE,
    `orders/${id}/accept-delivery`,
    {
      method: 'PATCH',
    }
  );
}

export async function setOrderPreparing(id: number) {
  return serverApiRequest<Order>(
    SERVICE,
    `orders/${id}/preparing`,
    {
      method: 'PATCH',
    }
  );
}

export async function setOrderOutForDelivery(id: number) {
  return serverApiRequest<Order>(
    SERVICE,
    `orders/${id}/out-for-delivery`,
    {
      method: 'PATCH',
    }
  );
}

export async function setOrderDelivered(id: number) {
  return serverApiRequest<Order>(
    SERVICE,
    `orders/${id}/delivered`,
    {
      method: 'PATCH',
    }
  );
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  return serverApiRequest<Order>(
    SERVICE,
    `orders/${id}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );
}

export async function verifyDeliveryCode(id: number, code: string) {
  return serverApiRequest<{ verified: boolean }>(
    SERVICE,
    `orders/${id}/verify-code`,
    {
      method: 'POST',
      body: JSON.stringify({ deliveryCode: code }),
    }
  );
}
