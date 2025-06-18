export type CartItem = {
    itemId: string;             // UUID du plat ou menu
    type: 'dish' | 'menu';      // Pour distinguer dans le cart
    name: string;               // Affichage UX
    quantity: number;
    specialInstructions?: string;
};

export type Cart = CartItem[];