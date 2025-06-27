'use client';

import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CartItemListProps {
  cart: any[];
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export default function CartItemList({ 
  cart, 
  removeFromCart, 
  updateQuantity 
}: CartItemListProps) {
  return (
    <div className="space-y-4">
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Your cart is empty</p>
        </div>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center space-x-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-xl border-gray-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none text-green-500 hover:text-green-600 hover:bg-green-50"
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none text-green-500 hover:text-green-600 hover:bg-green-50"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
              <span className="font-medium">
                {formatCurrency(item.price * item.quantity)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
