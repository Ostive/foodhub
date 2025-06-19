import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const restaurantId = params.restaurantId;
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL;

    if (!restaurantServiceUrl) {
      return NextResponse.json(
        { error: 'Restaurant service URL not configured' },
        { status: 500 }
      );
    }

    // Forward the request to the restaurant service
    const response = await fetch(
      `${restaurantServiceUrl}/api/restaurants/${restaurantId}/dishes`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch restaurant dishes' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching restaurant dishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant dishes' },
      { status: 500 }
    );
  }
}
