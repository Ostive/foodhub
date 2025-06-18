import { Cart, CartItem } from "./types";
import { getCart, clearCart } from "./cart_storage";

// Peut recevoir des infos de livraison en paramètres
export async function sendOrder({
    userId,
    restaurantId,
    deliveryAddress,
    deliveryInstructions,
}: {
    userId: string;
    restaurantId: string;
    deliveryAddress?: string;
    deliveryInstructions?: string;
}) {
    // 1. Lire le panier stocké
    const cart: Cart = getCart();

    // 2. Construire le payload
    const payload = {
        userId,
        restaurantId,
        items: cart, // Peut-être filtrer/mapper ici si besoin
        deliveryAddress,
        specialInstructions: deliveryInstructions,
    };

    // 3. Récupérer le JWT depuis le localStorage (ou via un state auth/global)
    const token = localStorage.getItem('token');

    // 4. Appeler l’API /api/order (route.ts)
    const response = await fetch('/api/order', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    // 5. Gérer la réponse
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la commande');
    }

    // 6. Nettoyer le panier si commande OK
    clearCart();

    return data;
}
