import { NextRequest, NextResponse } from 'next/server';

// Define the backend services and their base URLs
const SERVICES: Record<string, string> = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  restaurant: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
  delivery: process.env.DELIVERY_SERVICE_URL || 'http://localhost:3004',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
  user: process.env.USER_SERVICE_URL || 'http://localhost:3006',
};

// Placeholder mock responses for development
const MOCK_RESPONSES: Record<string, any> = {
  auth: {
    login: { success: true, token: "mock-jwt-token", user: { id: 1, name: "Mock User" } },
    register: { success: true, message: "User registered successfully" },
    verify: { success: true, message: "Token verified" }
  },
  restaurant: {
    list: [
      { id: 1, name: "Mock Restaurant 1", cuisine: "Italian", rating: 4.5 },
      { id: 2, name: "Mock Restaurant 2", cuisine: "Japanese", rating: 4.7 },
      { id: 3, name: "Mock Restaurant 3", cuisine: "Mexican", rating: 4.2 }
    ],
    menu: {
      items: [
        { id: 1, name: "Mock Dish 1", price: 12.99, description: "Delicious mock dish" },
        { id: 2, name: "Mock Dish 2", price: 9.99, description: "Another tasty mock dish" }
      ]
    }
  },
  order: {
    create: { success: true, orderId: "mock-order-123" },
    status: { status: "preparing", estimatedDelivery: "30 minutes" },
    history: [
      { id: "mock-order-100", date: "2025-06-10", status: "delivered" },
      { id: "mock-order-101", date: "2025-06-11", status: "delivered" }
    ]
  },
  delivery: {
    track: { status: "en route", location: { lat: 40.7128, lng: -74.0060 } },
    estimate: { minutes: 25 }
  },
  payment: {
    methods: [
      { id: 1, type: "credit_card", last4: "1234" },
      { id: 2, type: "paypal", email: "mock@example.com" }
    ],
    process: { success: true, transactionId: "mock-transaction-123" }
  },
  user: {
    profile: { id: 1, name: "Mock User", email: "mock@example.com", phone: "123-456-7890" },
    addresses: [
      { id: 1, street: "123 Mock St", city: "Mock City", zip: "12345" }
    ],
    preferences: { notifications: true, marketing: false }
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { service: string[] } }
) {
  return handleRequest('GET', request, params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { service: string[] } }
) {
  return handleRequest('POST', request, params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { service: string[] } }
) {
  return handleRequest('PUT', request, params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { service: string[] } }
) {
  return handleRequest('DELETE', request, params);
}

async function handleRequest(
  method: string,
  request: NextRequest,
  params: { service: string[] }
) {
  try {
    const [serviceName, ...pathParts] = params.service;
    const serviceUrl = SERVICES[serviceName];

    if (!serviceUrl) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // For now, return mock data instead of making actual API calls
    // This is a placeholder implementation
    const mockPath = pathParts.length > 0 ? pathParts[0] : 'default';
    
    if (MOCK_RESPONSES[serviceName] && MOCK_RESPONSES[serviceName][mockPath]) {
      return NextResponse.json(MOCK_RESPONSES[serviceName][mockPath]);
    }
    
    // If no specific mock data is found, return the entire service mock data
    if (MOCK_RESPONSES[serviceName]) {
      return NextResponse.json(MOCK_RESPONSES[serviceName]);
    }

    // If we were to actually make the API call, this is how it would look:
    /*
    // Reconstruct the target URL
    const targetUrl = new URL(pathParts.join('/'), serviceUrl);
    
    // Forward query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.append(key, value);
    });

    // Forward headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      headers.set(key, value);
    });

    // Forward the request to the target service
    const response = await fetch(targetUrl.toString(), {
      method,
      headers,
      body: method !== 'GET' && method !== 'HEAD' ? await request.text() : undefined,
    });

    // Return the response from the target service
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
    */

    // Default response if no mock data is found
    return NextResponse.json(
      { message: `Placeholder response for ${serviceName} service` },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Gateway Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
