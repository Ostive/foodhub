'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils'; 
import { AlertCircle, ShoppingBag, Trash2, MapPin, CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import AddressSelector from './_components/AddressSelector';
import PaymentMethodSelector from './_components/PaymentMethodSelector';
import OrderSummary from './_components/OrderSummary';

interface CartClientProps {
  addressSuggestions: any[];
  paymentMethods: any[];
  error?: string;
}

export default function CartClient({ addressSuggestions, paymentMethods, error }: CartClientProps) {
  const router = useRouter();
  const { cart = [], removeFromCart, updateQuantity, clearCart, isLoaded } = useCart();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  
  // Calculate totals - do this safely even if cart isn't loaded yet
  const cartArray = Array.isArray(cart) ? cart : [];
  const subtotal = cartArray.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 2.99 : 0;
  const serviceFee = subtotal > 0 ? 1.99 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  // Handle empty cart redirection - temporarily disabled for testing
  /*useEffect(() => {
    if (isLoaded && cartArray.length === 0 && !isSubmitting) {
      // Add a small delay to prevent flashing during normal page load
      const timer = setTimeout(() => {
        router.push('/customer');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cartArray, router, isSubmitting, isLoaded]);*/
  
  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setOrderError('Please select a delivery address');
      return;
    }

    if (!selectedPayment) {
      setOrderError('Please select a payment method');
      return;
    }

    try {
      setIsSubmitting(true);
      setOrderError(null);
      
      // Simulate order submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart and redirect to order confirmation
      clearCart();
      router.push('/customer/order-confirmation');
    } catch (err) {
      console.error('Order submission failed:', err);
      setOrderError('Failed to place your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Optional empty cart UI - comment out the if statement to always show the cart page for testing
  // We already handle empty cart redirection in the useEffect above,
  // but this is a fallback UI in case the redirect hasn't happened yet
  if (false && isLoaded && cartArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items to get started</p>
        <Button onClick={() => router.push('/customer')}>Browse Restaurants</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-green-600 drop-shadow-sm">Your Cart</h1>
      
      {(error || orderError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || orderError}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Cart Items */}
          <Card className="border-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle>Cart Items ({cartArray.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {cartArray.map((item) => (
                <div key={`${item.id}-${item.type}`} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-green-50/20 transition-colors rounded-lg px-3">
                  <div className="flex items-center">
                    <div className="w-20 h-20 relative rounded-lg overflow-hidden mr-4 shadow-md">
                      <Image 
                        src={item.image || '/placeholder-food.jpg'} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-green-600 font-medium">{formatCurrency(item.price)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-white rounded-lg shadow-sm border border-green-100">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="hover:bg-green-50 text-green-700 h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.type, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </Button>
                      <span className="mx-2 font-medium w-6 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="hover:bg-green-50 text-green-700 h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                      onClick={() => removeFromCart(item.id, item.type)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-gray-50/50 pt-4">
              <Button 
                variant="outline" 
                className="hover:bg-red-50 hover:text-red-600 border-green-200 flex items-center transition-colors" 
                onClick={() => clearCart()}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium">Subtotal: <span className="text-green-600">{formatCurrency(subtotal)}</span></p>
              </div>
            </CardFooter>
          </Card>

          {/* Delivery Address */}
          <Card className="border-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-green-50 bg-green-50/30">
              <CardTitle className="text-green-700 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressSelector 
                addresses={addressSuggestions} 
                selectedAddress={selectedAddress}
                onSelectAddress={setSelectedAddress}
              />
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-green-50 bg-green-50/30">
              <CardTitle className="text-green-700 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethodSelector 
                paymentMethods={paymentMethods}
                selectedPayment={selectedPayment}
                onSelectPayment={setSelectedPayment}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4 border-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-green-50 bg-green-50/30">
              <CardTitle className="text-green-700 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
                Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderSummary 
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                serviceFee={serviceFee}
                total={total}
              />
            </CardContent>
            <Separator className="bg-green-100" />
            <CardFooter className="pt-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300" 
                size="lg"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Place Order • {formatCurrency(total)}
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
