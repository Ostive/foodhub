import { Cart, CartItem } from './types';

const CART_KEY = 'user_cart';

export function getCart(): Cart {
    if (typeof window === 'undefined') return [];
    const str = localStorage.getItem(CART_KEY);
    return str ? JSON.parse(str) : [];
}

export function saveCart(cart: Cart) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item: CartItem) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.itemId === item.itemId && i.type === item.type);
    if (idx > -1) {
        cart[idx].quantity += item.quantity;
    } else {
        cart.push(item);
    }
    saveCart(cart);
}

export function removeFromCart(itemId: string, type: 'dish' | 'menu') {
    const cart = getCart().filter(i => !(i.itemId === itemId && i.type === type));
    saveCart(cart);
}

export function clearCart() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_KEY);
}

export function updateCartItemQuantity(itemId: string, type: 'dish' | 'menu', quantity: number) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.itemId === itemId && i.type === type);
    if (idx > -1) {
        if (quantity > 0) {
            cart[idx].quantity = quantity;
        } else {
            cart.splice(idx, 1);
        }
        saveCart(cart);
    }
}
