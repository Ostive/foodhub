import { NextRequest, NextResponse } from 'next/server';

/**
 * API Gateway Configuration
 * 
 * This file serves as an API gateway that proxies requests to the appropriate backend services.
 * It can also return mock data for development purposes when the USE_MOCK_DATA environment variable is set to 'true'.
 */

// Define the backend services and their base URLs
const SERVICES: Record<string, string> = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3004',
  user: process.env.USER_SERVICE_URL || 'http://localhost:3003',
  restaurant: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3002',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:3003',
  delivery: process.env.DELIVERY_SERVICE_URL || 'http://localhost:3005',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3006',
};


// API route handlers for different HTTP methods
export async function GET(request: NextRequest, { params }: { params: { service: string[] } }) {
  return handleRequest('GET', request, params);
}

export async function POST(request: NextRequest, { params }: { params: { service: string[] } }) {
  return handleRequest('POST', request, params);
}

export async function PUT(request: NextRequest, { params }: { params: { service: string[] } }) {
  return handleRequest('PUT', request, params);
}

export async function PATCH(request: NextRequest, { params }: { params: { service: string[] } }) {
  return handleRequest('PATCH', request, params);
}

export async function DELETE(request: NextRequest, { params }: { params: { service: string[] } }) {
  return handleRequest('DELETE', request, params);
}

/**
 * Handle API requests and proxy them to the appropriate backend service
 */
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

    // No mock data handling, always forward to real service

    try {
      return await forwardRequestToService(method, request, serviceName, pathParts, serviceUrl);
    } catch (error) {
      console.error('API Gateway Error:', error);
      return NextResponse.json(
        { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Gateway Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Mock response handling removed

/**
 * Forward the request to the appropriate backend service
 */
async function forwardRequestToService(
  method: string,
  request: NextRequest,
  serviceName: string,
  pathParts: string[],
  serviceUrl: string
) {
  // Reconstruct the target URL
  let targetPath = '';
  if (pathParts.length > 0) {
    targetPath = `/${pathParts.join('/')}`;
  }
  
  const targetUrl = new URL(targetPath, serviceUrl);
  
  // Forward query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  // Forward headers
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Skip next.js specific headers
    if (!key.startsWith('next-')) {
      headers.set(key, value);
    }
  });

  // Set content type if not already set
  if (!headers.has('Content-Type') && method !== 'GET' && method !== 'HEAD') {
    headers.set('Content-Type', 'application/json');
  }

  console.log(`Forwarding ${method} request to: ${targetUrl.toString()}`);
  
  // Forward the request to the target service
  const response = await fetch(targetUrl.toString(), {
    method,
    headers,
    body: method !== 'GET' && method !== 'HEAD' ? await request.text() : undefined,
  });

  // Return the response from the target service
  return formatServiceResponse(response);
}

/**
 * Format the response from the backend service
 */
async function formatServiceResponse(response: Response) {
  const contentType = response.headers.get('Content-Type') || '';
  
  if (contentType.includes('application/json')) {
    const data = await response.json();
    return NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } else {
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
  }
}
