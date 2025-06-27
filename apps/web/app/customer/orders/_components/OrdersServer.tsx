import { ClientOrder, ClientOrderStatus } from '../_types/OrderTypes';
import { getEmptyOrdersData, getUserIdByEmail, normalizeImageUrl } from '../_services/OrderService';

/**
 * Main function to fetch customer orders from the API
 */
export async function getCustomerOrders(): Promise<{
  orders: ClientOrder[];
  error: string | null;
}> {
  try {
    // Get auth token from cookies
    const cookieStore = await (await import('next/headers')).cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    if (!authToken) {
      return getEmptyOrdersData('No authentication token found');
    }
    
    // Decode JWT token to get user email
    const tokenParts = authToken.split('.');
    if (tokenParts.length !== 3) {
      return getEmptyOrdersData('Invalid token format');
    }
    
    try {
      // Decode payload part of JWT
      const payload = JSON.parse(atob(tokenParts[1]));
      const email = payload.email;
      
      if (!email) {
        return getEmptyOrdersData('No email found in token');
      }
      
      // Get user ID from email
      const userId = await getUserIdByEmail(email, authToken);
      if (!userId) {
        return getEmptyOrdersData('No user ID found for email');
      }
      
      // Fetch orders by user ID
      const response = await fetch(`${process.env.ORDER_SERVICE_URL}/api/orders/customer/${userId}`, {
        cache: "no-store",
        next: { revalidate: 60 },
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
      }
      
      const apiOrders = await response.json();
      
      // Handle different API response formats
      let ordersToProcess = [];
      if (Array.isArray(apiOrders)) {
        ordersToProcess = apiOrders;
      } else if (apiOrders.data && Array.isArray(apiOrders.data)) {
        ordersToProcess = apiOrders.data;
      } else {
        return getEmptyOrdersData('Invalid API response format');
      }
      
      // Return empty array without error when no orders are found
      if (ordersToProcess.length === 0) {
        return {
          orders: [],
          error: null
        };
      }
      
      // Transform API orders to client format
      const transformedOrders = await Promise.all(ordersToProcess.map(async (order: any) => {
        // Process order and return client format
        return processOrder(order, authToken);
      }));
      
      return {
        orders: transformedOrders,
        error: null
      };
    } catch (error) {
      return getEmptyOrdersData(error instanceof Error ? error.message : "Failed to fetch orders");
    }
  } catch (error) {
    return getEmptyOrdersData(error instanceof Error ? error.message : "Failed to fetch orders");
  }
}

/**
 * Maps API order status to client-side order status
 */
function mapOrderStatus(apiStatus: string): ClientOrderStatus {
  switch (apiStatus?.toLowerCase()) {
    case 'delivered':
      return 'delivered';
    case 'cancelled':
    case 'rejected':
      return 'cancelled';
    case 'created':
    case 'accepted':
    case 'preparing':
    case 'ready':
    case 'out_for_delivery':
    default:
      return 'processing';
  }
}

/**
 * Process a single order into client format
 */
async function processOrder(order: any, authToken: string): Promise<ClientOrder> {
  const orderId = order.orderId || order.id;
  const restaurantId = order.restaurantId;
  
  // Get restaurant data
  let restaurantName = order.restaurantName || "Restaurant";
  let restaurantImage = "/images/default-restaurant.png";
  
  try {
    const restaurantResponse = await fetch(`${process.env.RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}`, {
      cache: "no-store",
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (restaurantResponse.ok) {
      const restaurantData = await restaurantResponse.json();
      restaurantName = restaurantData.name || restaurantName;
      restaurantImage = normalizeImageUrl(restaurantData.profilePicture, "/images/default-restaurant.png");
    }
  } catch (error) {
    // Use default values if restaurant fetch fails
  }
  
  // Process order items
  const items = await processOrderItems(order, restaurantId, authToken);
  
  // Format date properly
  let orderDate = new Date();
  try {
    if (order.date) {
      orderDate = new Date(order.date);
    } else if (order.createdAt) {
      orderDate = new Date(order.createdAt);
    } else if (order.time) {
      orderDate = new Date(order.time);
    }
  } catch (error) {
    // Use current date if parsing fails
  }
  
  // Format total price
  const total = order.cost || order.totalAmount || order.total || 0;
  const deliveryFee = order.deliveryFee || order.deliveryFeeAmount || 0;
  
  return {
    id: String(orderId),
    restaurantId: String(restaurantId),
    restaurantName,
    restaurantImage,
    date: orderDate.toISOString(),
    total: typeof total === 'string' ? total : `$${Number(total).toFixed(2)}`,
    status: mapOrderStatus(order.status),
    items,
    deliveryAddress: order.deliveryAddress || order.deliveryLocalisation || "",
    deliveryFee: typeof deliveryFee === 'string' ? deliveryFee : `$${Number(deliveryFee).toFixed(2)}`
  };
}

/**
 * Process order items (dishes and menus)
 */
async function processOrderItems(order: any, restaurantId: string, authToken: string) {
  const items = [];
  
  // Process dishes
  if (order.orderDishes && Array.isArray(order.orderDishes)) {
    for (const dish of order.orderDishes) {
      const dishId = dish.dishId || dish.id;
      let dishName = dish.name || `Dish ${dishId}`;
      let dishImage = "/images/default-dish.png";
      let dishPrice = dish.price || 0;
      
      try {
        const dishResponse = await fetch(`${process.env.RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}/dishes/${dishId}`, {
          cache: "no-store",
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (dishResponse.ok) {
          const dishData = await dishResponse.json();
          const actualDishData = dishData.dish || dishData;
          
          dishName = actualDishData.name || dishName;
          if (dish.price === undefined || dish.price === null) {
            dishPrice = actualDishData.cost || actualDishData.price || dishPrice;
          }
          dishImage = normalizeImageUrl(actualDishData.picture, "/images/default-dish.png");
        }
      } catch (error) {
        // Use default values if dish fetch fails
      }
      
      items.push({
        id: String(dishId),
        name: dishName,
        quantity: dish.quantity || 1,
        price: typeof dishPrice === 'string' ? dishPrice : `$${Number(dishPrice).toFixed(2)}`,
        image: dishImage
      });
    }
  }
  
  // Process menus
  if (order.orderMenus && Array.isArray(order.orderMenus)) {
    for (const menu of order.orderMenus) {
      const menuId = menu.menuId || menu.id;
      let menuName = menu.name || `Menu ${menuId}`;
      let menuImage = "/images/default-menu.png";
      let menuPrice = menu.price || 0;
      
      try {
        const menuResponse = await fetch(`${process.env.RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}/menus`, {
          cache: "no-store",
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        if (menuResponse.ok) {
          const menusData = await menuResponse.json();
          const menus = menusData.menus || menusData;
          
          if (Array.isArray(menus)) {
            const foundMenu = menus.find(m => (m.menuId || m.id) == menuId);
            if (foundMenu) {
              menuName = foundMenu.name || menuName;
              if (menu.price === undefined || menu.price === null) {
                menuPrice = foundMenu.cost || foundMenu.price || menuPrice;
              }
              menuImage = normalizeImageUrl(foundMenu.picture, "/images/default-menu.png");
            }
          }
        }
      } catch (error) {
        // Use default values if menu fetch fails
      }
      
      items.push({
        id: String(menuId),
        name: menuName,
        quantity: menu.quantity || 1,
        price: typeof menuPrice === 'string' ? menuPrice : `$${Number(menuPrice).toFixed(2)}`,
        image: menuImage
      });
    }
  }
  
  return items;
}

/**
 * Helper function to get orders data with fallback to empty data if API fails
 */
export async function getOrdersWithFallback(): Promise<{
  orders: ClientOrder[];
  error: string | null;
}> {
  try {
    // Try to get real orders data
    const result = await getCustomerOrders();
    return result;
  } catch (error) {
    // Return empty orders if there's an error
    return {
      orders: [],
      error: error instanceof Error ? error.message : 'Failed to fetch orders'
    };
  }
}