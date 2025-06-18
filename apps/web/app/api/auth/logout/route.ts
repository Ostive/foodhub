import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServiceUrl } from '@/lib/config/services';

// Schema for validating logout request
const logoutSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedData = logoutSchema.parse(body);

    // Forward the request to the auth service
    const authServiceUrl = getServiceUrl('auth');
    const response = await fetch(`${authServiceUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    // Get the response data
    const data = await response.json();

    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Logout error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request data', errors: error.errors },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { message: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
