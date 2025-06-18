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

export type Cart = CartItem[];