import { NextRequest, NextResponse } from 'next/server';
import { RestaurantSchema } from '@/lib/schemas/restaurant.schema';

/**
 * Restaurant API endpoint
 * 
 * This endpoint handles restaurant operations.
 * GET: Fetch all restaurants or filter by query parameters
 * POST: Create a new restaurant (requires restaurant owner authentication)
 */

// Get restaurants
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const cuisineType = searchParams.get('cuisineType');
    const priceRange = searchParams.get('priceRange');
    const rating = searchParams.get('rating');
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (cuisineType) queryParams.append('cuisineType', cuisineType);
    if (priceRange) queryParams.append('priceRange', priceRange);
    if (rating) queryParams.append('rating', rating);
    
    // Forward the request to the restaurant service
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
    const url = `${restaurantServiceUrl}/restaurants${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the response from the restaurant service
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Restaurant API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Create restaurant
export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Forward the request to the restaurant service
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
    const response = await fetch(`${restaurantServiceUrl}/restaurants`, {
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
    console.error('Restaurant API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
