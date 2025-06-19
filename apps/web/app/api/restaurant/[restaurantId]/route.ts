import { NextRequest, NextResponse } from 'next/server';

/**
 * Restaurant Details API endpoint
 * 
 * This endpoint handles operations for a specific restaurant.
 * GET: Fetch restaurant details by ID
 */

// Get restaurant by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    // Fix for NextJS 14: await params before accessing properties
    const { restaurantId } = await params;
    
    // Forward the request to the restaurant service
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
    const response = await fetch(`${restaurantServiceUrl}/api/restaurants/${restaurantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Restaurant not found' },
        { status: response.status }
      );
    }

    // Return the response from the restaurant service
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Restaurant Details API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
