'use client';

import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Plus } from 'lucide-react';

interface AddressSelectorProps {
  addresses: any[];
  selectedAddress: string;
  onSelectAddress: (address: string) => void;
  hideAddButton?: boolean; // Optional prop to hide the Add New Address button
}

export default function AddressSelector({
  addresses,
  selectedAddress,
  onSelectAddress,
  hideAddButton = false // Default to showing the button
}: AddressSelectorProps) {
  const [showAddNew, setShowAddNew] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      onSelectAddress(newAddress);
      setNewAddress('');
      setShowAddNew(false);
    }
  };

  return (
    <div>
      {addresses.length > 0 && (
        <RadioGroup value={selectedAddress} onValueChange={onSelectAddress}>
          {addresses.map((address, index) => (
            <div key={index} className="flex items-start space-x-2 mb-3 p-3 border rounded-xl">
              <RadioGroupItem 
                value={address.id} 
                id={`address-${index}`} 
              />
              <div className="grid gap-1">
                <Label htmlFor={`address-${index}`} className="font-medium">
                  Delivery Address
                </Label>
                <p className="text-sm text-gray-500">
                  {address.street}{address.street && address.zipCode ? ', ' : ''}
                  {address.zipCode}{address.zipCode && address.city ? ' ' : ''}
                  {address.city}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>
      )}

      {!showAddNew ? (
        !hideAddButton && (
          <Button
            variant="outline"
            className="mt-2 text-green-500 border-green-500 hover:bg-green-50"
            onClick={() => setShowAddNew(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Address
          </Button>
        )
      ) : (
        <div className="mt-4 space-y-2">
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <Input
                placeholder="Rue (ex: 123 rue de Paris)"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleAddAddress} className="bg-green-500 hover:bg-green-600 text-white">Enregistrer l'adresse</Button>
            <Button variant="outline" onClick={() => setShowAddNew(false)} className="border hover:bg-gray-50">
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
