'use client';

import { useRouter } from 'next/navigation';
import { useCart, CartItem, CartItemType } from '@/lib/hooks/useCart';
import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { LogIn, AlertCircle, ShoppingBag } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils';
import { useUserCheckoutData } from './_hooks/useUserCheckoutData';
import { useOrderSubmission } from './_hooks/useOrderSubmission';
import { useState } from 'react';
import CartItemList from './_components/CartItemList';
import OrderSummary from './_components/OrderSummary';
import CheckoutForm from './_components/CheckoutForm';

interface CartClientProps {
  addressSuggestions: any[];
  paymentMethods: any[];
  error?: string;
}

export default function CartClient({ addressSuggestions, paymentMethods, error: serverError }: CartClientProps) {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, isLoaded } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  // Custom state for guest checkout
  const [customAddress, setCustomAddress] = useState('');
  const [customPaymentMethod, setCustomPaymentMethod] = useState('cash');
  
  // Use our custom hooks for checkout data and order submission
  const {
    fetchedAddresses,
    fetchedPaymentMethods,
    selectedAddress,
    selectedPayment,
    isFetching,
    fetchError,
    setSelectedAddress,
    setSelectedPayment
  } = useUserCheckoutData();

  const {
    isSubmitting,
    orderError,
    submitOrder
  } = useOrderSubmission();

  // Calculate order summary
  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 2.99 : 0;
  const serviceFee = subtotal > 0 ? 1.99 : 0;
  const total = subtotal + deliveryFee + serviceFee;
  
  // Order submission handler
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty. Add items before placing an order.');
      return;
    }
    
    if (!isAuthenticated) {
      if (!customAddress) {
        toast.error('Please enter a delivery address');
        return;
      }
    } else {
      if (!selectedAddress) {
        toast.error('Please select a delivery address');
        return;
      }
      if (!selectedPayment) {
        toast.error('Please select a payment method');
        return;
      }
    }
    
    try {
      const deliveryAddress = isAuthenticated 
        ? (fetchedAddresses.find(addr => addr.id === selectedAddress)?.address || '')
        : customAddress;
      
      const paymentMethod = isAuthenticated
        ? selectedPayment
        : customPaymentMethod;
      
      // Get restaurant ID from first cart item (assuming all items are from same restaurant)
      const restaurantId = cart[0]?.restaurantId;
      
      if (restaurantId === undefined) {
        toast.error('Invalid cart data. Missing restaurant information.');
        return;
      }
      
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          type: item.type
        })),
        restaurantId,
        deliveryAddress,
        paymentMethod,
        subtotal,
        deliveryFee,
        serviceFee,
        total
      };
      
      // Call submitOrder with the required parameters
      await submitOrder(deliveryAddress, paymentMethod);
      
      // The success handling is done inside the submitOrder function
      // No need to check for success here
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  // Handler for saving new address
  const handleSaveNewAddress = () => {
    // Here you would typically make an API call to save the address
    toast.success('New address saved successfully!');
  };
  
  // Handler for saving new payment method
  const handleSaveNewPayment = () => {
    // Here you would typically make an API call to save the payment method
    toast.success('New payment method saved successfully!');
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white rounded-lg">
        <div className="text-center p-8">
          <div className="relative mx-auto w-16 h-16 mb-4">
            <ShoppingBag className="mx-auto h-16 w-16 text-green-500 animate-pulse" />
          </div>
          <h3 className="mt-2 text-xl font-semibold text-gray-800">Loading your cart...</h3>
          <div className="mt-4 w-48 h-1 mx-auto bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-white rounded-xl border border-gray-100">
        <div className="text-center max-w-md p-8">
          <div className="relative mx-auto w-24 h-24 mb-6 bg-green-50 rounded-full flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6 text-lg">Looks like you haven't added anything to your cart yet.</p>
          <Button 
            onClick={() => router.push('/customer/restaurants')} 
            className="mt-2 bg-green-500 hover:bg-green-600 transition-all duration-200 text-white px-8 py-6 rounded-xl"
            size="lg"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
      {/* Checkout Form - Left Side (2/3 width) */}
      <div className="lg:col-span-2 space-y-8">
        {/* Cart Items */}
        <Card className="overflow-hidden border rounded-xl">
          <CardHeader className="bg-white border-b py-4">
            <CardTitle className="text-xl font-bold flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-green-500" />
              Your Order
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {serverError && (
              <Alert variant="destructive" className="mb-6 rounded-xl">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <CartItemList 
              cart={cart} 
              removeFromCart={(id: string) => removeFromCart(Number(id), cart.find(item => item.id === Number(id))?.type || 'dish')} 
              updateQuantity={(id: string, quantity: number) => {
                const item = cart.find(item => item.id === Number(id));
                if (item) {
                  updateQuantity(Number(id), item.type, quantity);
                }
              }} 
            />
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <Card className="overflow-hidden border rounded-xl">
          <CardHeader className="bg-white border-b py-4">
            <CardTitle className="text-xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Delivery & Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {!isAuthenticated ? (
              <div className="mb-6">
                <Alert className="bg-gray-50 border rounded-xl">
                  <AlertCircle className="h-5 w-5 text-gray-500" />
                  <AlertTitle className="font-semibold">Guest Checkout</AlertTitle>
                  <AlertDescription>
                    You are checking out as a guest. 
                    <Button variant="link" className="p-0 h-auto font-semibold text-green-500 hover:text-green-600" onClick={() => router.push('/auth/login')}>
                      <LogIn className="h-4 w-4 mr-1" /> Log in
                    </Button> to access your saved addresses and payment methods.
                  </AlertDescription>
                </Alert>
              </div>
            ) : null}

            <CheckoutForm 
              isAuthenticated={isAuthenticated}
              isFetching={isFetching}
              fetchedAddresses={fetchedAddresses}
              fetchedPaymentMethods={fetchedPaymentMethods}
              selectedAddress={selectedAddress}
              selectedPayment={selectedPayment}
              setSelectedAddress={setSelectedAddress}
              setSelectedPayment={setSelectedPayment}
              customAddress={customAddress}
              setCustomAddress={setCustomAddress}
              customPaymentMethod={customPaymentMethod}
              setCustomPaymentMethod={setCustomPaymentMethod}
              handleSaveNewAddress={handleSaveNewAddress}
              handleSaveNewPayment={handleSaveNewPayment}
            />

            {orderError && (
              <Alert variant="destructive" className="mt-6 rounded-xl">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="font-semibold">Error</AlertTitle>
                <AlertDescription>{orderError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary - Right Side (1/3 width) */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <Card className="overflow-hidden border rounded-xl">
          <CardHeader className="bg-white border-b py-4">
            <CardTitle className="text-xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <OrderSummary 
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              serviceFee={serviceFee}
              total={total}
            />
            
            {/* Order Button */}
            <Button 
              className="w-full mt-6 bg-green-500 hover:bg-green-600 transition-all duration-200 text-white rounded-xl py-6" 
              size="lg" 
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cart.length === 0}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></span>
                  Processing...
                </span>
              ) : (
                <span className="text-lg font-semibold">
                  Place Order • {formatCurrency(total)}
                </span>
              )}
            </Button>
            <p className="text-xs text-center text-gray-500 mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}