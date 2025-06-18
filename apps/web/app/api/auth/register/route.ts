import { NextRequest, NextResponse } from 'next/server';
import { RegisterCustomerSchema } from '@/lib/schemas/user.schema';

/**
 * Register API endpoint
 * 
 * This endpoint handles user registration by forwarding the request to the auth service.
 * It validates the request body against the RegisterCustomerSchema.
 */

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate against schema
    const result = RegisterCustomerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      );
    }

    // Forward the request to the auth service
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3004';
    const response = await fetch(`${authServiceUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result.data),
    });

    // Return the response from the auth service
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
