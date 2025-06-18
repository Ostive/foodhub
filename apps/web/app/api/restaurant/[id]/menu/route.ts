import { NextRequest, NextResponse } from 'next/server';

/**
 * Restaurant Menu API endpoint
 * 
 * This endpoint handles operations for a restaurant's menu.
 * GET: Fetch all menu items for a restaurant
 * POST: Add a new menu item (requires restaurant owner authentication)
 */

// Get restaurant menu
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurantId = params.id;
    
    // Forward the request to the restaurant service
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
    const response = await fetch(`${restaurantServiceUrl}/restaurants/${restaurantId}/menu`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Menu not found' },
        { status: response.status }
      );
    }

    // Return the response from the restaurant service
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Restaurant Menu API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Add menu item
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurantId = params.id;
    
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    
    // Forward the request to the restaurant service
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
    const response = await fetch(`${restaurantServiceUrl}/restaurants/${restaurantId}/menu`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Return the response from the restaurant service
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Add Menu Item API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
