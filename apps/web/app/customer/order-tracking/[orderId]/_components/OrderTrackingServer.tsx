import { Order } from "@/lib/api/orders-api";

/**
 * Server component that fetches order data by ID
 * This is a server-only component that fetches data and passes it to the client
 */
export async function getOrderData(orderId: string): Promise<{
  order: Order | null;
  error: string | null;
}> {
  try {
    // Fetch order data from API
    const response = await fetch(`${process.env.ORDER_SERVICE_URL}/orders/${orderId}`, {
      cache: "no-store", // Don't cache to ensure fresh data
      next: { revalidate: 30 } // Revalidate every 30 seconds as fallback
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }
    
    const order = await response.json();
    
    return {
      order,
      error: null
    };
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    return {
      order: null,
      error: error instanceof Error ? error.message : "Failed to fetch order details"
    };
  }
}

// Mock order data for development/testing
export const mockOrders: Record<string, any> = {
  "order-123": {
    id: "order-123",
    status: "on_the_way",
    restaurant: {
      id: "rest-456",
      name: "Burger Palace",
      image: "/images/restaurants/burger-palace.jpg",
      phone: "555-123-4567"
    },
    customer: {
      name: "John Doe",
      address: "123 Main St, Anytown, USA"
    },
    delivery: {
      estimatedTime: "30-40 min",
      driver: {
        name: "Mike Smith",
        phone: "555-987-6543",
        image: "/images/drivers/driver1.jpg",
        eta: "10 minutes",
      }
    },
    items: [
      {
        id: "item-1",
        name: "Double Cheeseburger",
        quantity: 2,
        price: "$12.99",
        options: ["No pickles", "Extra sauce"]
      },
      {
        id: "item-2",
        name: "French Fries (Large)",
        quantity: 1,
        price: "$4.99"
      },
      {
        id: "item-3",
        name: "Chocolate Milkshake",
        quantity: 1,
        price: "$5.99"
      }
    ],
    placedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    total: "$36.96",
    subtotal: "$31.97",
    deliveryFee: "$4.99",
    tax: "$2.88"
  }
};

// Helper function to get order data (uses mock data if API fails)
export async function getOrderDataWithFallback(orderId: string): Promise<{
  order: any;
  error: string | null;
}> {
  try {
    const { order, error } = await getOrderData(orderId);
    
    // If API call fails but we have mock data for this order ID, use that
    if (!order && mockOrders[orderId]) {
      return {
        order: mockOrders[orderId],
        error: null
      };
    }
    
    return { order, error };
  } catch (error) {
    // Fallback to mock data if available
    if (mockOrders[orderId]) {
      return {
        order: mockOrders[orderId],
        error: null
      };
    }
    
    return {
      order: null,
      error: error instanceof Error ? error.message : "Failed to fetch order details"
    };
  }
}
