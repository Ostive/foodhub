// Define OrderStatus enum directly since we're having import issues
export enum OrderStatus {
  CREATED = 'created',
  ACCEPTED_RESTAURANT = 'accepted_restaurant',
  PREPARING = 'preparing',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered'
}
