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
  { params }: { params: { restaurantId: string } }
) {
  try {
    const restaurantId = params.restaurantId;
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';

    if (!restaurantServiceUrl) {
      return NextResponse.json(
        { error: 'Restaurant service URL not configured' },
        { status: 500 }
      );
    }

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
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Restaurant Dishes API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
