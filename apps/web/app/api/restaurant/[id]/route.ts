import { NextRequest, NextResponse } from 'next/server';

/**
 * Restaurant Details API endpoint
 * 
 * This endpoint handles operations for a specific restaurant.
 * GET: Fetch restaurant details by ID
 * PUT: Update restaurant details (requires owner authentication)
 * DELETE: Delete a restaurant (requires owner authentication)
 */

// Get restaurant by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Forward the request to the restaurant service
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
    const response = await fetch(`${restaurantServiceUrl}/restaurants/${id}`, {
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

// Update restaurant
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    
    // Forward the request to the restaurant service
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
    const response = await fetch(`${restaurantServiceUrl}/restaurants/${id}`, {
      method: 'PUT',
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
    console.error('Restaurant Update API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Delete restaurant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Forward the request to the restaurant service
    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002';
    const response = await fetch(`${restaurantServiceUrl}/restaurants/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Return the response from the restaurant service
    const data = await response.json().catch(() => ({}));
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Restaurant Delete API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
