import { ClientOrder, ClientOrderStatus } from '../_types/OrderTypes';

/**
 * Empty orders array to return when no orders are found
 */
export const emptyOrders: ClientOrder[] = [
  {
    id: "0",
    restaurantId: "0",
    restaurantName: "No orders found",
    restaurantImage: "/images/default-restaurant.png",
    date: new Date().toISOString(),
    total: "$0.00",
    status: "cancelled" as ClientOrderStatus,
    deliveryAddress: "",
    deliveryFee: "$0.00",
    items: []
  }
];

/**
 * Returns empty orders data with an optional error message
 */
export function getEmptyOrdersData(errorMessage: string | null = null): {
  orders: ClientOrder[];
  error: string | null;
} {
  return {
    orders: emptyOrders,
    error: errorMessage ? `No orders available: ${errorMessage}` : null
  };
}

/**
 * Gets the user ID from the user service by email
 */
export async function getUserIdByEmail(email: string, authToken: string): Promise<string | null> {
  try {
    const userResponse = await fetch(`${process.env.USER_SERVICE_URL}/api/users/customers/email/${encodeURIComponent(email)}`, {
      cache: "no-store",
      next: { revalidate: 60 },
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.status} ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    return userData.id || userData.userId || null;
  } catch (error) {
    throw new Error(`Error fetching user ID: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Gets restaurant data by ID
 */
export async function getRestaurantById(restaurantId: string): Promise<any> {
  try {
    const restaurantResponse = await fetch(`${process.env.RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}`, {
      cache: "no-store",
      next: { revalidate: 60 }
    });

    if (!restaurantResponse.ok) {
      throw new Error(`Failed to fetch restaurant: ${restaurantResponse.status}`);
    }

    return await restaurantResponse.json();
  } catch (error) {
    throw new Error(`Error fetching restaurant: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Gets dish data by ID
 */
export async function getDishById(restaurantId: string, dishId: string): Promise<any> {
  try {
    const dishResponse = await fetch(`${process.env.RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}/dishes/${dishId}`, {
      cache: "no-store",
      next: { revalidate: 60 }
    });

    if (!dishResponse.ok) {
      throw new Error(`Failed to fetch dish: ${dishResponse.status}`);
    }

    return await dishResponse.json();
  } catch (error) {
    throw new Error(`Error fetching dish: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Gets menu data by ID
 */
export async function getMenuById(restaurantId: string, menuId: string): Promise<any> {
  try {
    const menusResponse = await fetch(`${process.env.RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}/menus`, {
      cache: "no-store",
      next: { revalidate: 60 }
    });

    if (!menusResponse.ok) {
      throw new Error(`Failed to fetch menus: ${menusResponse.status}`);
    }

    const menusData = await menusResponse.json();
    const menus = menusData.menus || menusData;
    
    if (!Array.isArray(menus)) {
      throw new Error('Menus data is not an array');
    }
    
    const foundMenu = menus.find(m => (m.menuId || m.id) == menuId);
    if (!foundMenu) {
      throw new Error(`Menu not found with ID: ${menuId}`);
    }
    
    return foundMenu;
  } catch (error) {
    throw new Error(`Error fetching menu: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Normalizes an image URL by ensuring it has the proper base URL
 */
export function normalizeImageUrl(imageUrl: string | undefined, defaultImage: string = '/images/default-dish.png'): string {
  if (!imageUrl) {
    return defaultImage;
  }
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  } else if (imageUrl.startsWith('/')) {
    return `${process.env.RESTAURANT_SERVICE_URL}${imageUrl}`;
  } else {
    return `${process.env.RESTAURANT_SERVICE_URL}/${imageUrl}`;
  }
}
