import { NextRequest, NextResponse } from 'next/server';
import { CustomerProfileSchema } from '@/lib/schemas/user.schema';

/**
 * Customer Profile API endpoint
 * 
 * This endpoint handles customer profile operations.
 * GET: Fetch the customer profile
 * PUT: Update the customer profile
 */

// Get customer profile
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Forward the request to the user service
    const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3003';
    const response = await fetch(`${userServiceUrl}/customers/profile`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    // Return the response from the user service
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Customer Profile API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Update customer profile
export async function PUT(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Forward the request to the user service
    const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3003';
    const response = await fetch(`${userServiceUrl}/customers/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Return the response from the user service
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Customer Profile API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
