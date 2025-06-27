'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, MapPin, CreditCard, ShoppingBag, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';

interface CheckoutFormProps {
  isAuthenticated: boolean;
  isFetching: boolean;
  fetchedAddresses: any[];
  fetchedPaymentMethods: any[];
  selectedAddress: string;
  selectedPayment: string;
  setSelectedAddress: (address: string) => void;
  setSelectedPayment: (payment: string) => void;
  customAddress: string;
  setCustomAddress: (address: string) => void;
  customPaymentMethod: string;
  setCustomPaymentMethod: (method: string) => void;
  handleSaveNewAddress: () => void;
  handleSaveNewPayment: () => void;
}

export default function CheckoutForm({
  isAuthenticated,
  isFetching,
  fetchedAddresses,
  fetchedPaymentMethods,
  selectedAddress,
  selectedPayment,
  setSelectedAddress,
  setSelectedPayment,
  customAddress,
  setCustomAddress,
  customPaymentMethod,
  setCustomPaymentMethod,
  handleSaveNewAddress,
  handleSaveNewPayment
}: CheckoutFormProps) {
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    street: '',
    zipCode: '',
    city: ''
  });
  // State for new payment method form
  const [newPaymentForm, setNewPaymentForm] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: ''
  });

  // Handle input change for payment form
  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save new payment method
  const handleSaveNewPaymentMethod = () => {
    // Format card number to show only last 4 digits
    const last4 = newPaymentForm.cardNumber.slice(-4);
    
    // Call the parent function to save the payment method
    handleSaveNewPayment();
    
    // Reset form and close dialog
    setNewPaymentForm({
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: ''
    });
    setPaymentDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">

      {/* Delivery Address */}
      <Card className="mb-6 overflow-hidden border rounded-xl">
        <CardHeader className="bg-white border-b py-4">
          <CardTitle className="text-xl font-bold flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-500" />
            Delivery Address
            {!isAuthenticated && (
              <span className="ml-2 text-sm text-muted-foreground">(Guest checkout)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            isFetching ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
                <span className="ml-2">Loading your addresses...</span>
              </div>
            ) : fetchedAddresses.length > 0 ? (
              <div className="space-y-4">
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  {fetchedAddresses.map((address) => (
                    <div key={address.id} className="flex items-center space-x-2 p-2 rounded border border-gray-200 mb-2">
                      <RadioGroupItem value={address.id} id={`address-${address.id}`} />
                      <Label htmlFor={`address-${address.id}`} className="flex-1">
                        {address.address}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <AlertDialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 flex items-center gap-1 text-green-500 border-green-500 hover:bg-green-50"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add New Address
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Add New Address</AlertDialogTitle>
                      <AlertDialogDescription>
                        Fill in the details below to add a new delivery address.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="street" className="text-right">Rue</label>
                        <Input 
                          id="street" 
                          value={newAddressForm.street} 
                          onChange={(e) => setNewAddressForm({...newAddressForm, street: e.target.value})} 
                          placeholder="123 rue de Paris" 
                          className="col-span-3" 
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="zipCode" className="text-right">Code Postal</label>
                        <Input 
                          id="zipCode" 
                          value={newAddressForm.zipCode} 
                          onChange={(e) => setNewAddressForm({...newAddressForm, zipCode: e.target.value})} 
                          placeholder="75001" 
                          className="col-span-3" 
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="city" className="text-right">Ville</label>
                        <Input 
                          id="city" 
                          value={newAddressForm.city} 
                          onChange={(e) => setNewAddressForm({...newAddressForm, city: e.target.value})} 
                          placeholder="Paris" 
                          className="col-span-3" 
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border hover:bg-gray-50">Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSaveNewAddress} className="bg-green-500 hover:bg-green-600">Enregistrer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">No saved addresses found.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setAddressDialogOpen(true)}
                  className="flex items-center gap-1 text-green-500 border-green-500 hover:bg-green-50"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add New Address
                </Button>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <Input
                  placeholder="Enter your delivery address"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="mb-6 overflow-hidden border rounded-xl">
        <CardHeader className="bg-white border-b py-4">
          <CardTitle className="text-xl font-bold flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-green-500" />
            Payment Method
            {!isAuthenticated && (
              <span className="ml-2 text-sm text-muted-foreground">(Guest checkout)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            isFetching ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
                <span className="ml-2">Loading your payment methods...</span>
              </div>
            ) : fetchedPaymentMethods.length > 0 ? (
              <div className="space-y-4">
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                  {fetchedPaymentMethods.map((payment) => (
                    <div key={payment.id} className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 mb-2 bg-white hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value={payment.id} id={`payment-${payment.id}`} />
                      <div className="flex-1">
                        <Label htmlFor={`payment-${payment.id}`} className="font-medium text-gray-900">
                          {payment.type === 'card' ? `Card ending in ${payment.last4}` : payment.type}
                        </Label>
                        {payment.expiryDate && (
                          <p className="text-sm text-gray-500 mt-1">Expires: {payment.expiryDate}</p>
                        )}
                        {payment.cardholderName && (
                          <p className="text-sm text-gray-500">{payment.cardholderName}</p>
                        )}
                      </div>
                      <CreditCard className="h-5 w-5 text-green-500 ml-2" />
                    </div>
                  ))}
                </RadioGroup>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPaymentDialogOpen(true)}
                  className="mt-2 flex items-center gap-1 text-green-500 border-green-500 hover:bg-green-50"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add New Payment Method
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">No saved payment methods found.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPaymentDialogOpen(true)}
                  className="flex items-center gap-1 text-green-500 border-green-500 hover:bg-green-50"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add New Payment Method
                </Button>
              </div>
            )
          ) : (
            <div className="space-y-4">
              <RadioGroup value={customPaymentMethod} onValueChange={setCustomPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 mb-2 bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="cash" id="payment-cash" />
                  <div className="flex-1">
                    <Label htmlFor="payment-cash" className="font-medium text-gray-900">Cash on Delivery</Label>
                    <p className="text-sm text-gray-500 mt-1">Pay with cash when your order arrives</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 mb-2 bg-white hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="card" id="payment-card" />
                  <div className="flex-1">
                    <Label htmlFor="payment-card" className="font-medium text-gray-900">Credit Card on Delivery</Label>
                    <p className="text-sm text-gray-500 mt-1">Pay with card when your order arrives</p>
                  </div>
                  <CreditCard className="h-5 w-5 text-green-500 ml-2" />
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
      </Card>


    
      {/* Payment Method Dialog */}
      <AlertDialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <AlertDialogContent className="rounded-xl shadow-[0_10px_40px_-5px_rgba(0,0,0,0.1)] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-green-500" />
              Add New Payment Method
            </AlertDialogTitle>
            <AlertDialogDescription>
              Add your payment details below. Your information is secure and encrypted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="font-medium">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={newPaymentForm.cardNumber}
                onChange={handlePaymentInputChange}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardholderName" className="font-medium">Cardholder Name</Label>
              <Input
                id="cardholderName"
                name="cardholderName"
                placeholder="John Doe"
                value={newPaymentForm.cardholderName}
                onChange={handlePaymentInputChange}
                className="rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="font-medium">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={newPaymentForm.expiryDate}
                  onChange={handlePaymentInputChange}
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="font-medium">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  type="password"
                  placeholder="123"
                  value={newPaymentForm.cvv}
                  onChange={handlePaymentInputChange}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-lg border-gray-300 hover:bg-gray-50 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSaveNewPaymentMethod}
              className="rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors shadow-[0_4px_12px_-2px_rgba(22,163,74,0.3)]"
            >
              Save Payment Method
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
