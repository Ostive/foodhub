import { NextRequest, NextResponse } from 'next/server';
import { DeliveryPersonSchema } from '@/lib/schemas/delivery.schema';

/**
 * Delivery API endpoint
 * 
 * This endpoint handles delivery operations.
 * GET: Fetch deliveries for the authenticated delivery person or restaurant
 * POST: Register as a delivery person
 */

// Get deliveries
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
    
    // Forward the request to the delivery service
    const deliveryServiceUrl = process.env.DELIVERY_SERVICE_URL || 'http://localhost:3005';
    const url = `${deliveryServiceUrl}/deliveries${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    // Return the response from the delivery service
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Delivery API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Register as delivery person
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
    const result = DeliveryPersonSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Forward the request to the delivery service
    const deliveryServiceUrl = process.env.DELIVERY_SERVICE_URL || 'http://localhost:3005';
    const response = await fetch(`${deliveryServiceUrl}/delivery-persons`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result.data),
    });

    // Return the response from the delivery service
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Register Delivery Person API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
