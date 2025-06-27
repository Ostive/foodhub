import { NextRequest, NextResponse } from 'next/server';
import { CreateOrderSchema, OrderDishSchema, OrderMenuSchema } from '@/lib/schemas/order.schema';

/**
 * Order API endpoint
 * 
 * This endpoint handles order operations.
 * GET: Fetch orders for the authenticated user
 * POST: Create a new order
 */

// Get orders for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    
    // Forward the request to the order service
    const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';
    const url = `${orderServiceUrl}/orders${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    // Return the response from the order service
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Order API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Define cart item type
    interface CartItem {
      id: string;
      type: string;
      quantity: number;
      price?: number;
      specialInstructions?: string;
    }
    
    // Transform legacy cart format if needed
    if (body.cartItems && Array.isArray(body.cartItems)) {
      // Initialize dishes and menus arrays if they don't exist
      if (!body.dishes) body.dishes = [];
      if (!body.menus) body.menus = [];
      
      // Convert cartItems to dishes and menus
      body.cartItems.forEach((item: CartItem) => {
        if (item.type === 'dish') {
          body.dishes.push({
            dishId: parseInt(item.id),
            quantity: item.quantity,
            price: item.price || 0
          });
        } else if (item.type === 'menu') {
          body.menus.push({
            menuId: parseInt(item.id),
            quantity: item.quantity,
            price: item.price || 0
          });
        }
      });
    }
    
    // Convert deliveryAddress to deliveryLocalisation if needed
    if (body.deliveryAddress && !body.deliveryLocalisation) {
      body.deliveryLocalisation = body.deliveryAddress;
    }
    
    // Set current time if not provided
    if (!body.time) {
      body.time = new Date().toISOString();
    }
    
    // Set status to 'created' if not provided
    if (!body.status) {
      body.status = 'created';
    }
    
    // Validate against schema
    const result = CreateOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Prepare the order data for the order service
    const orderData = {
      customerId: result.data.customerId,
      restaurantId: result.data.restaurantId,
      deliveryLocalisation: result.data.deliveryLocalisation,
      time: result.data.time,
      cost: result.data.cost,
      deliveryFee: result.data.deliveryFee,
      status: result.data.status,
      dishes: result.data.dishes,
      menus: result.data.menus || []
    };
    
    // Forward the request to the order service
    const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3001';
    const response = await fetch(`${orderServiceUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    // Return the response from the order service
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Create Order API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
