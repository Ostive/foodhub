// app/api/keys/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://localhost:3007/api/keys');
  const data = await res.json();
  return NextResponse.json(data);
}
