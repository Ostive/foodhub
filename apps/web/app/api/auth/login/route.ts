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
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request format', message: 'Could not parse request body as JSON' },
        { status: 400 }
      );
    }
    
    // Validate against schema
    const result = LoginCredentialsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid credentials format', message: 'Please provide a valid email and password', details: result.error.format() },
        { status: 400 }
      );
    }

    // Forward the request to the auth service
    const authServiceUrl = getServiceUrl('auth');
    let response;
    
    try {
      response = await fetch(`${authServiceUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.data),
      });
    } catch (fetchError) {
      console.error('Auth service connection error:', fetchError);
      return NextResponse.json(
        { error: 'Service unavailable', message: 'Authentication service is currently unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    // Try to parse the response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Error parsing auth service response:', parseError);
      return NextResponse.json(
        { error: 'Invalid response', message: 'Received an invalid response from the authentication service' },
        { status: 502 }
      );
    }
    
    // Return the response with appropriate status
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'Authentication error', message: error instanceof Error ? error.message : 'An unexpected error occurred during login' },
      { status: 500 }
    );
  }
}
