'use client';

import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
}

export default function OrderSummary({
  subtotal,
  deliveryFee,
  serviceFee,
  total
}: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Delivery Fee</span>
        <span>{formatCurrency(deliveryFee)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Service Fee</span>
        <span>{formatCurrency(serviceFee)}</span>
      </div>
      <Separator className="bg-green-100" />
      <div className="flex justify-between font-bold">
        <span className="text-green-700">Total</span>
        <span className="text-green-700 text-lg">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
