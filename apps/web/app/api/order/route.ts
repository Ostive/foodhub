import { NextRequest, NextResponse } from 'next/server';
import { CreateOrderSchema } from '@/lib/schemas/order.schema';

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
    
    // Validate against schema
    const result = CreateOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Forward the request to the order service
    const orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';
    const response = await fetch(`${orderServiceUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result.data),
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
