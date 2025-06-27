/**
 * Status types for client-side orders
 */
export type ClientOrderStatus = 'processing' | 'delivered' | 'cancelled';

/**
 * Order item structure for client-side display
 */
export interface ClientOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  image: string;
}

/**
 * Order structure for client-side display
 */
export interface ClientOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  total: string;
  status: ClientOrderStatus;
  deliveryAddress: string;
  deliveryFee: string;
  items: ClientOrderItem[];
}
