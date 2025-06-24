/**
 * React Query hooks for order-related API operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ordersApi,
  Order,
  OrderStatus,
  CreateOrderDto,
  UpdateOrderDto
} from '../api/orders-api';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
  status: (status: OrderStatus) => [...orderKeys.all, 'status', status] as const,
  deliveryPerson: (id: number) => [...orderKeys.all, 'delivery-person', id] as const,
  availableForDelivery: () => [...orderKeys.all, 'available-for-delivery'] as const,
};

// Order hooks
export function useOrders(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: () => ordersApi.getAll(),
    enabled: options?.enabled,
  });
}

export function useOrder(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: options?.enabled !== false && !!id,
  });
}

export function useOrderWithItems(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...orderKeys.detail(id), 'items'],
    queryFn: () => ordersApi.getWithItems(id),
    enabled: options?.enabled !== false && !!id,
  });
}

export function useOrdersByStatus(status: OrderStatus, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: orderKeys.status(status),
    queryFn: () => ordersApi.getByStatus(status),
    enabled: options?.enabled !== false && !!status,
  });
}

export function useOrdersByDeliveryPerson(deliveryPersonId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: orderKeys.deliveryPerson(deliveryPersonId),
    queryFn: () => ordersApi.getByDeliveryPerson(deliveryPersonId),
    enabled: options?.enabled !== false && !!deliveryPersonId,
  });
}

export function useOrdersAvailableForDelivery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: orderKeys.availableForDelivery(),
    queryFn: () => ordersApi.getAvailableForDelivery(),
    enabled: options?.enabled,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData: CreateOrderDto) => ordersApi.create(orderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.status(data.status) });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, orderData }: { id: number; orderData: UpdateOrderDto }) => 
      ordersApi.update(id, orderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.status(data.status) });
    },
  });
}

// Order status update hooks
export function useAcceptOrderByRestaurant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: number) => ordersApi.status.acceptByRestaurant(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.status('pending') });
      queryClient.invalidateQueries({ queryKey: orderKeys.status('accepted_by_restaurant') });
    },
  });
}

export function useAcceptOrderByDelivery() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: number) => ordersApi.status.acceptByDelivery(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.status('accepted_by_restaurant') });
      queryClient.invalidateQueries({ queryKey: orderKeys.status('accepted_by_delivery') });
      queryClient.invalidateQueries({ queryKey: orderKeys.availableForDelivery() });
      if (data.deliveryPersonId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.deliveryPerson(data.deliveryPersonId) });
      }
    },
  });
}

export function useSetOrderPreparing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: number) => ordersApi.status.setPreparing(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.status('accepted_by_delivery') });
      queryClient.invalidateQueries({ queryKey: orderKeys.status('preparing') });
      if (data.deliveryPersonId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.deliveryPerson(data.deliveryPersonId) });
      }
    },
  });
}

export function useSetOrderOutForDelivery() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: number) => ordersApi.status.setOutForDelivery(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.status('preparing') });
      queryClient.invalidateQueries({ queryKey: orderKeys.status('out_for_delivery') });
      if (data.deliveryPersonId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.deliveryPerson(data.deliveryPersonId) });
      }
    },
  });
}

export function useSetOrderDelivered() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: number) => ordersApi.status.setDelivered(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.status('out_for_delivery') });
      queryClient.invalidateQueries({ queryKey: orderKeys.status('delivered') });
      if (data.deliveryPersonId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.deliveryPerson(data.deliveryPersonId) });
      }
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: OrderStatus }) => 
      ordersApi.status.update(orderId, status),
    onSuccess: (data, { status: oldStatus }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.status(oldStatus) });
      queryClient.invalidateQueries({ queryKey: orderKeys.status(data.status) });
      if (data.deliveryPersonId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.deliveryPerson(data.deliveryPersonId) });
      }
    },
  });
}

export function useVerifyDeliveryCode() {
  return useMutation({
    mutationFn: ({ orderId, code }: { orderId: number; code: string }) => 
      ordersApi.verifyDeliveryCode(orderId, code),
  });
}
