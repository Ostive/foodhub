// app/api/keys/[apiName]/regenerate/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { apiName: string } }) {
  const { apiName } = params;

  try {
    const res = await fetch(`http://localhost:3007/api/keys/${apiName}/regenerate`, {
      method: 'POST',
    });

    if (!res.ok) {
      // Propager une erreur si la requête échoue côté backend
      return NextResponse.json(
        { error: 'Erreur lors de la régénération de la clé' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    // Gestion d'erreur serveur / réseau
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur serveur, veuillez réessayer plus tard' },
      { status: 500 }
    );
  }
}
