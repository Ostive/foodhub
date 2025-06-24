import { Order, OrderStatus, OrderItem } from "@/lib/api/orders-api";

/**
 * Server component that fetches customer orders
 * This is a server-only component that fetches data and passes it to the client
 */
export async function getCustomerOrders(): Promise<{
  orders: Order[];
  error: string | null;
}> {
  try {
    // Fetch orders data from API
    const userId = "current"; // In a real app, this would be the authenticated user's ID
    const response = await fetch(`${process.env.ORDER_SERVICE_URL}/orders/customer/${userId}`, {
      cache: "no-store", // Don't cache to ensure fresh data
      next: { revalidate: 60 } // Revalidate every minute as fallback
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }
    
    const orders = await response.json();
    
    return {
      orders,
      error: null
    };
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return getMockOrdersData(error instanceof Error ? error.message : "Failed to fetch orders");
  }
}

// Mock orders data for development/testing that matches the Order type
export const mockOrders: Order[] = [
  {
    id: 123,
    customerId: 1001,
    restaurantId: 456,
    status: OrderStatus.PREPARING,
    totalAmount: 36.96,
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
    deliveryFee: 2.99,
    paymentMethod: "credit_card",
    paymentStatus: "completed",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    // Additional frontend-only properties for display
    restaurantName: "Burger Palace",
    restaurantImage: "/images/restaurants/burger-palace.jpg",
    items: [
      {
        id: 1,
        orderId: 123,
        dishId: 101,
        quantity: 2,
        price: 12.99,
        createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
        // Frontend-only properties
        name: "Double Cheeseburger",
        image: "/images/dishes/burger.jpg"
      } as OrderItem & { name: string, image: string },
      {
        id: 2,
        orderId: 123,
        dishId: 102,
        quantity: 1,
        price: 4.99,
        createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
        // Frontend-only properties
        name: "Fries",
        image: "/images/dishes/fries.jpg"
      } as OrderItem & { name: string, image: string },
      {
        id: 3,
        orderId: 123,
        dishId: 103,
        quantity: 1,
        price: 5.99,
        createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
        // Frontend-only properties
        name: "Chocolate Shake",
        image: "/images/dishes/shake.jpg"
      } as OrderItem & { name: string, image: string }
    ]
  } as Order & { restaurantName: string, restaurantImage: string },
  {
    id: 456,
    customerId: 1001,
    restaurantId: 789,
    status: OrderStatus.DELIVERED,
    totalAmount: 42.50,
    deliveryAddress: "456 Park Ave, Suite 201, New York, NY 10022",
    deliveryFee: 3.99,
    paymentMethod: "credit_card",
    paymentStatus: "completed",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60000 + 30 * 60000).toISOString(),
    // Additional frontend-only properties for display
    restaurantName: "Pizza Haven",
    restaurantImage: "/images/restaurants/pizza-haven.jpg",
    items: [
      {
        id: 4,
        orderId: 456,
        dishId: 201,
        quantity: 1,
        price: 18.99,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
        // Frontend-only properties
        name: "Large Pepperoni Pizza",
        image: "/images/dishes/pizza.jpg"
      } as OrderItem & { name: string, image: string },
      {
        id: 5,
        orderId: 456,
        dishId: 202,
        quantity: 2,
        price: 6.99,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
        // Frontend-only properties
        name: "Garlic Knots",
        image: "/images/dishes/garlic-knots.jpg"
      } as OrderItem & { name: string, image: string },
      {
        id: 6,
        orderId: 456,
        dishId: 203,
        quantity: 1,
        price: 9.99,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
        // Frontend-only properties
        name: "Caesar Salad",
        image: "/images/dishes/salad.jpg"
      } as OrderItem & { name: string, image: string }
    ]
  } as Order & { restaurantName: string, restaurantImage: string },
  {
    id: 789,
    customerId: 1001,
    restaurantId: 123,
    status: OrderStatus.DELIVERED,
    totalAmount: 58.75,
    deliveryAddress: "789 Broadway, Floor 3, New York, NY 10003",
    deliveryFee: 4.99,
    paymentMethod: "credit_card",
    paymentStatus: "completed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60000 + 45 * 60000).toISOString(),
    // Additional frontend-only properties for display
    restaurantName: "Sushi Spot",
    restaurantImage: "/images/restaurants/sushi-spot.jpg",
    items: [
      {
        id: 7,
        orderId: 789,
        dishId: 301,
        quantity: 2,
        price: 12.99,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
        // Frontend-only properties
        name: "California Roll",
        image: "/images/dishes/california-roll.jpg"
      } as OrderItem & { name: string, image: string },
      {
        id: 8,
        orderId: 789,
        dishId: 302,
        quantity: 1,
        price: 14.99,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString(),
        // Frontend-only properties
        name: "Spicy Tuna Roll",
        image: "/images/dishes/spicy-tuna.jpg"
      } as OrderItem & { name: string, image: string }
    ]
  } as Order & { restaurantName: string, restaurantImage: string }
];

/**
 * Helper function to get mock orders data when API fails
 */
function getMockOrdersData(errorMessage: string | null = null): {
  orders: Order[];
  error: string | null;
} {
  return {
    orders: mockOrders,
    error: errorMessage
  };
}

/**
 * Helper function to get orders data with fallback to mock data if API fails
 */
export async function getOrdersWithFallback(): Promise<{
  orders: Order[];
  error: string | null;
}> {
  try {
    // Try to get real orders data
    const result = await getCustomerOrders();
    
    // If we got an error or no orders, use mock data
    if (result.error || result.orders.length === 0) {
      console.log("Using mock orders data due to API error or empty response");
      return {
        orders: mockOrders,
        error: result.error
      };
    }
    
    return result;
  } catch (error) {
    console.error("Error in getOrdersWithFallback:", error);
    return getMockOrdersData(error instanceof Error ? error.message : "Failed to fetch orders");
  }
}
