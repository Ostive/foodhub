'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreditCard, Plus } from 'lucide-react';

interface PaymentMethodSelectorProps {
  paymentMethods: any[];
  selectedPayment: string;
  onSelectPayment: (payment: string) => void;
}

export default function PaymentMethodSelector({
  paymentMethods,
  selectedPayment,
  onSelectPayment
}: PaymentMethodSelectorProps) {
  const [showAddNew, setShowAddNew] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');

  const handleAddCard = () => {
    if (newCardNumber && newCardName && newCardExpiry && newCardCvc) {
      // In a real app, you would validate and securely process this information
      onSelectPayment(`${newCardNumber.slice(-4)}`);
      setNewCardNumber('');
      setNewCardName('');
      setNewCardExpiry('');
      setNewCardCvc('');
      setShowAddNew(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <div>
      {paymentMethods.length > 0 && (
        <RadioGroup value={selectedPayment} onValueChange={onSelectPayment}>
          {paymentMethods.map((method, index) => (
            <div key={index} className="flex items-start space-x-2 mb-3">
              <RadioGroupItem value={method.id} id={`payment-${index}`} />
              <div className="grid gap-1">
                <Label htmlFor={`payment-${index}`} className="font-medium">
                  {method.name}
                </Label>
                <p className="text-sm text-gray-500">
                  {method.type === 'credit_card' 
                    ? `Expires ${method.expiryDate}` 
                    : ''}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
      )}

      {!showAddNew ? (
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => setShowAddNew(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Payment Method
        </Button>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
              <Label>Card Information</Label>
            </div>
            <Input
              placeholder="Card number"
              value={newCardNumber}
              onChange={(e) => setNewCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
            <Input
              placeholder="Name on card"
              value={newCardName}
              onChange={(e) => setNewCardName(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="MM/YY"
                value={newCardExpiry}
                onChange={(e) => setNewCardExpiry(formatExpiryDate(e.target.value))}
                maxLength={5}
              />
              <Input
                placeholder="CVC"
                value={newCardCvc}
                onChange={(e) => setNewCardCvc(e.target.value.replace(/\D/g, ''))}
                maxLength={3}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleAddCard}>Save Card</Button>
            <Button variant="outline" onClick={() => setShowAddNew(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
