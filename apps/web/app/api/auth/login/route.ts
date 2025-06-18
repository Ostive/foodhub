import { NextRequest, NextResponse } from 'next/server';
import { LoginCredentialsSchema } from '@/lib/schemas/auth.schema';
import { getServiceUrl } from '@/lib/config/services';

/**
 * Login API endpoint
 * 
 * This endpoint handles user authentication by forwarding the request to the auth service.
 * It validates the request body against the LoginCredentialsSchema.
 */

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate against schema
    const result = LoginCredentialsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() },
        { status: 400 }
      );
    }

    // Forward the request to the auth service
    const authServiceUrl = getServiceUrl('auth');
    const response = await fetch(`${authServiceUrl}/api/auth/login`, {
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
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
