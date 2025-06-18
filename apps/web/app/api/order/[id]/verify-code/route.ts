import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/api/order-service';

/**
 * API endpoint to verify delivery code
 * POST /api/order/[id]/verify-code
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const { code } = await request.json();

    // In a real application, this would check the code against the database
    // For now, we'll use our local implementation to verify the code
    
    // Call the backend API to verify the code
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-service/api/orders/${orderId}/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}
