import { ClientOrder, ClientOrderStatus } from '../_types/OrderTypes';
import { getEmptyOrdersData, getUserIdByEmail, getRestaurantById, getDishById, getMenuById, normalizeImageUrl } from './OrderService';

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
        return await processOrderData(order, authToken);
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
 * Process a single order's data
 */
async function processOrderData(order: any, authToken: string): Promise<ClientOrder> {
  const orderId = order.orderId || order.id;
  const restaurantId = order.restaurantId;
  
  // Get restaurant data
  let restaurantName = order.restaurantName || "Restaurant";
  let restaurantImage = "/images/default-restaurant.png";
  
  try {
    const restaurantData = await getRestaurantById(restaurantId);
    restaurantName = restaurantData.name || restaurantName;
    restaurantImage = normalizeImageUrl(restaurantData.image, "/images/default-restaurant.png");
  } catch (error) {
    // Use data from order if restaurant fetch fails
  }
  
  // Process order items
  const items = await processOrderItems(order, restaurantId, authToken);
  
  // Format date properly
  let orderDate = new Date().toISOString();
  try {
    if (order.date) {
      orderDate = new Date(order.date).toISOString();
    } else if (order.createdAt) {
      orderDate = new Date(order.createdAt).toISOString();
    }
  } catch (error) {
    // Use current date if parsing fails
  }
  
  return {
    id: String(orderId),
    restaurantId: String(restaurantId),
    restaurantName,
    restaurantImage,
    date: orderDate,
    total: order.total || `$${order.totalPrice?.toFixed(2) || '0.00'}`,
    status: mapOrderStatus(order.status),
    items,
    deliveryAddress: order.deliveryAddress || "",
    deliveryFee: order.deliveryFee || `$${order.deliveryFeeAmount?.toFixed(2) || '0.00'}`
  };
}

/**
 * Process order items (dishes and menus)
 */
async function processOrderItems(order: any, restaurantId: string, authToken: string) {
  const items = [];
  
  // Process dishes
  if (order.orderDishes && Array.isArray(order.orderDishes)) {
    const dishItems = await Promise.all(order.orderDishes.map(async (dish: any) => {
      return await processDishItem(dish, restaurantId, authToken);
    }));
    items.push(...dishItems);
  }
  
  // Process menus
  if (order.orderMenus && Array.isArray(order.orderMenus)) {
    const menuItems = await Promise.all(order.orderMenus.map(async (menu: any) => {
      return await processMenuItem(menu, restaurantId, authToken);
    }));
    items.push(...menuItems);
  }
  
  return items;
}

/**
 * Process a dish item
 */
async function processDishItem(dish: any, restaurantId: string, authToken: string) {
  const dishId = dish.dishId || dish.id;
  let dishName = "";
  let dishImage = "";
  let dishPrice = dish.price || 0;
  let dishFound = false;
  
  try {
    const dishData = await getDishById(restaurantId, dishId);
    dishName = dishData.name || dishName;
    // Only use API price if we don't have a stored price
    if (dish.price === undefined || dish.price === null) {
      dishPrice = dishData.cost || dishData.price || dishPrice;
    }
    dishImage = normalizeImageUrl(dishData.picture, "/images/default-dish.png");
    dishFound = true;
  } catch (error) {
    // Use fallback if fetch fails
  }
  
  // Only use the ID-based fallback name if we couldn't find a real name
  if (!dishFound || !dishName) {
    dishName = `Dish ${dishId}`;
  }
  
  return {
    id: String(dishId),
    name: dishName,
    quantity: dish.quantity || 1,
    price: `$${(dishPrice).toFixed(2)}`,
    image: dishImage
  };
}

/**
 * Process a menu item
 */
async function processMenuItem(menu: any, restaurantId: string, authToken: string) {
  const menuId = menu.menuId || menu.id;
  let menuName = "";
  let menuImage = "";
  let menuPrice = menu.price || 0;
  let menuFound = false;
  
  try {
    const menuData = await getMenuById(restaurantId, menuId);
    menuName = menuData.name || menuName;
    // Only use API price if we don't have a stored price
    if (menu.price === undefined || menu.price === null) {
      menuPrice = menuData.cost || menuData.price || menuPrice;
    }
    menuImage = normalizeImageUrl(menuData.picture, "/images/default-menu.png");
    menuFound = true;
  } catch (error) {
    // Use fallback if fetch fails
  }
  
  // Only use the ID-based fallback name if we couldn't find a real name
  if (!menuFound || !menuName) {
    menuName = `Menu ${menuId}`;
  }
  
  return {
    id: String(menuId),
    name: menuName,
    quantity: menu.quantity || 1,
    price: `$${(menuPrice).toFixed(2)}`,
    image: menuImage
  };
}
