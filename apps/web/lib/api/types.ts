export type CartItem = {
    id: string;
    type: 'dish' | 'menu';
    name: string;
    price: string;
    image: string;
    quantity: number;
    restaurantId: string;
    restaurantName: string;
    specialInstructions?: string;
};

export enum OrderStatus {
    CREATED = 'created',
    ACCEPTED_RESTAURANT = 'accepted_restaurant',
    ACCEPTED_DELIVERY = 'accepted_delivery',
    PREPARING = 'preparing',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered'
}

export type OrderDetails = {
    orderId: number;
    items: CartItem[];
    customerId: number;
    restaurantId: number;
    deliveryId?: number;
    deliveryAddress: string;
    deliveryInstructions?: string;
    status: OrderStatus;
    total: number;
    time: Date;
    verificationCode?: string;
};

export type DeliveryAddress = {
    address: string;
    latitude?: number;
    longitude?: number;
    instructions?: string;
};

export type PaymentMethod = {
    id: string;
    type: "card" | "cash";
    lastFour?: string;
    cardType?: string;
};

export type Cart = CartItem[];