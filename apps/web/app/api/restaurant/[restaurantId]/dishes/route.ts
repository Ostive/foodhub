import { NextRequest, NextResponse } from 'next/server';

/**
 * Restaurant Dishes API endpoint
 * 
 * This endpoint handles operations for dishes of a specific restaurant.
 * GET: Fetch all dishes for a restaurant by ID
 */

// Get all dishes for a restaurant
export async function GET(
  request: Request,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    // Fix for NextJS 14: await params before accessing properties
    const { restaurantId } = await params;
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';

    if (!restaurantServiceUrl) {
      return NextResponse.json(
        { error: 'Restaurant service URL not configured' },
        { status: 500 }
      );
    }

    console.log(`Fetching dishes from: ${restaurantServiceUrl}/api/restaurants/${restaurantId}/dishes`);
    
    // Forward the request to the restaurant service
    const response = await fetch(`${restaurantServiceUrl}/api/restaurants/${restaurantId}/dishes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch dishes' },
        { status: response.status }
      );
    }

    // Return the response from the restaurant service
    const data = await response.json();
    console.log(`Received dishes data from restaurant service:`, JSON.stringify(data, null, 2));
    
    // Check if we need to extract the dishes array from a nested structure
    if (data && data.dishes && Array.isArray(data.dishes)) {
      console.log('Returning dishes array from nested structure');
      return NextResponse.json(data.dishes);
    } else {
      console.log('Returning data as is');
      return NextResponse.json(data);
    }
    
  } catch (error) {
    console.error('Restaurant Dishes API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
