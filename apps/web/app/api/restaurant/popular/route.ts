import { NextRequest, NextResponse } from 'next/server';

/**
 * Popular Restaurants API endpoint
 * 
 * This endpoint fetches popular restaurants sorted by rating and review count.
 * GET: Fetch popular restaurants with optional limit parameter
 */

// Get popular restaurants
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    
    // Build query string
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit);
    
    // Forward the request to the restaurant service
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
    const url = `${restaurantServiceUrl}/api/restaurants/popular${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Don't cache this request
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch popular restaurants: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching popular restaurants:', error);
    return NextResponse.json(
      { message: 'Failed to fetch popular restaurants', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
