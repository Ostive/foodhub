// Define the order tracking types to match our processed order structure
interface OrderRestaurant {
  id: string;
  name: string;
  image: string;
  phone: string;
}

interface OrderCustomer {
  name: string;
  address: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: string;
  image?: string;
}

interface Order {
  id: string;
  status: string;
  placedAt: string;
  restaurant: OrderRestaurant;
  customer: OrderCustomer;
  items: OrderItem[];
  total: string;
  subtotal: string;
  deliveryFee: string;
  tax: string;
  verificationCode?: string;
}

/**
 * Server component that fetches order data by ID
 * This is a server-only component that fetches data and passes it to the client
 */
export async function getOrderData(orderId: string): Promise<{
  order: Order | null;
  error: string | null;
}> {
  try {
    // Get auth token from cookies
    const cookieStore = await (await import('next/headers')).cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    if (!authToken) {
      return {
        order: null,
        error: 'No authentication token found'
      };
    }
    
    // Fetch order data from API using the correct endpoint
    let response;
    
    try {
      // Use the correct endpoint: /api/orders/:id with GET method
      response = await fetch(`${process.env.ORDER_SERVICE_URL}/api/orders/${orderId}`, {
        method: 'GET',
        cache: "no-store", // Use no-store for real-time data without caching
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error(`Failed to connect to order service: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Handle 404 Not Found errors specially
    if (response.status === 404) {
      return {
        order: null,
        error: null // Return null to trigger the "not found" UI instead of error UI
      };
    }
    
    // Handle other error responses
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.status} ${response.statusText}`);
    }
    
    const orderData = await response.json();
    
    // Process the order data to match the expected format for the client
    const processedOrder = {
      id: String(orderData.orderId),
      status: orderData.status || 'processing',
      placedAt: orderData.time || new Date().toISOString(),
      restaurant: {
        id: String(orderData.restaurantId),
        name: orderData.restaurantName || 'Restaurant',
        image: orderData.restaurantImage || '/images/default-restaurant.png',
        phone: orderData.restaurantPhone || '555-123-4567'
      },
      customer: {
        name: orderData.customerName || 'Customer',
        address: orderData.deliveryLocalisation || ''
      },
      // Add sample items if none are provided by the API
      items: orderData.orderDishes || orderData.orderItems || [
        {
          id: "sample-1",
          name: "Sample Dish",
          quantity: 1,
          price: "$10.99",
          image: "/images/default-dish.png"
        }
      ],
      total: typeof orderData.cost === 'number' ? `$${orderData.cost.toFixed(2)}` : '$0.00',
      subtotal: typeof orderData.cost === 'number' ? `$${(orderData.cost - (orderData.deliveryFee || 0)).toFixed(2)}` : '$0.00',
      deliveryFee: typeof orderData.deliveryFee === 'number' ? `$${orderData.deliveryFee.toFixed(2)}` : '$0.00',
      tax: typeof orderData.tax === 'number' ? `$${orderData.tax.toFixed(2)}` : '$0.00',
      verificationCode: orderData.verificationCode || ''
    };
    
    // Try to fetch additional restaurant details if we have a restaurant ID
    try {
      if (orderData.restaurantId) {
        const restaurantResponse = await fetch(`${process.env.RESTAURANT_SERVICE_URL}/api/restaurants/${orderData.restaurantId}`, {
          cache: "no-store",
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (restaurantResponse.ok) {
          const restaurantData = await restaurantResponse.json();
          processedOrder.restaurant.name = restaurantData.name || processedOrder.restaurant.name;
          processedOrder.restaurant.image = restaurantData.profilePicture || processedOrder.restaurant.image;
          processedOrder.restaurant.phone = restaurantData.phone || processedOrder.restaurant.phone;
        }
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      // Continue with the order data we have
    }
    
    return {
      order: processedOrder,
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

// Helper function to get order data with proper error handling
export async function getOrderDataWithFallback(orderId: string): Promise<{
  order: any;
  error: string | null;
}> {
  try {
    const { order, error } = await getOrderData(orderId);
    
    // If the error is related to "No order found", we don't treat it as an error
    // This allows the client to show a friendly "Order not found" message
    if (error && (error.includes('No order found') || error.includes('Order not found'))) {
      return {
        order: null,
        error: null // Return null error to trigger the "not found" UI instead of error UI
      };
    }
    
    return { order, error };
  } catch (error) {
    return {
      order: null,
      error: error instanceof Error ? error.message : "Failed to fetch order details"
    };
  }
}
