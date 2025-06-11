export interface PreviousOrder {
  id: string;
  items: {
    id: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
    selectedOptions?: {
      size?: string;
      ingredients?: string[];
      sauce?: string;
    };
  }[];
  date: string;
  total: string;
}

export interface OrderItem {
  quantity: number;
  orderDate: string;
  selectedOptions?: {
    size?: string;
    ingredients?: string[];
    sauce?: string;
  };
}
