"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ChevronLeft, Minus, Plus, Trash2, CreditCard, Clock, MapPin, X, Search, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomerNavbar from "../_components/CustomerNavbar";
import { useCart } from '@/contexts/CartContext';


const userId = "CUSTOMER_ID_CONNECTE"; // Remplace par l'id user actuel (venant du contexte ou session)

interface CartItem {
  id: string;
  type: 'dish' | 'menu';
  name: string;
  price: string;
  image: string;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  specialInstructions?: string;
}

interface DeliveryAddress {
  address: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
}

// Sample address suggestions for the location change feature
const addressSuggestions = [
  { id: "addr1", address: "123 Main St, Apt 4B, New York, NY 10001", latitude: 40.7128, longitude: -74.006 },
  { id: "addr2", address: "456 Park Ave, Suite 201, New York, NY 10022", latitude: 40.7580, longitude: -73.9855 },
  { id: "addr3", address: "789 Broadway, Floor 3, New York, NY 10003", latitude: 40.7320, longitude: -73.9950 },
  { id: "addr4", address: "321 5th Avenue, New York, NY 10016", latitude: 40.7448, longitude: -73.9867 },
  { id: "addr5", address: "555 West 57th St, New York, NY 10019", latitude: 40.7685, longitude: -73.9865 },
];

export default function CartPage() {
  const router = useRouter();
  const { cartItems, addToCart, removeFromCart, getItemQuantity, clearCart } = useCart();
  const [formattedCartItems, setFormattedCartItems] = useState<CartItem[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    address: "123 Main St, Apt 4B, New York, NY 10001",
    latitude: 40.7128,
    longitude: -74.006
  });
  const [deliveryInstructions, setDeliveryInstructions] = useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "card-1", type: "card", lastFour: "4242", cardType: "Visa" },
    { id: "cash", type: "cash" }
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card-1");
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoCodeApplied, setPromoCodeApplied] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  
  // Mock address suggestions for testing
  const addressSuggestions = [
    { id: "addr1", address: "123 Main St, Apt 4B, New York, NY 10001", latitude: 40.7128, longitude: -74.006 },
    { id: "addr2", address: "456 Park Ave, Suite 8, New York, NY 10022", latitude: 40.7589, longitude: -73.9851 },
    { id: "addr3", address: "789 Broadway, Floor 3, New York, NY 10003", latitude: 40.7309, longitude: -73.9973 },
  ];
  
  // Location change modal state
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredAddresses, setFilteredAddresses] = useState(addressSuggestions);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Map related state and refs
  const [selectionMethod, setSelectionMethod] = useState<'text' | 'map'>('text');
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<[number, number]>([-74.006, 40.7128]);
  const [addressFromMap, setAddressFromMap] = useState<string>("");
  
  // Fetch menu items for all restaurants that have items in the cart
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // For now, we'll use mock data
        // In a real app, we would fetch menu items from the API based on the restaurant IDs in the cart
        setMenuItems([
          {
            id: "margherita-pizza",
            name: "Margherita Pizza",
            price: "$12.99",
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
            restaurantId: "pizza-palace",
            restaurantName: "Pizza Palace"
          },
          {
            id: "pepperoni-pizza",
            name: "Pepperoni Pizza",
            price: "$14.99",
            image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
            restaurantId: "pizza-palace",
            restaurantName: "Pizza Palace"
          },
        ]);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    
    fetchMenuItems();
  }, []);
  
  // Format cart items with menu item details
  useEffect(() => {
    if (menuItems.length > 0) {
      const items = Object.entries(cartItems).map(([itemId, quantity]) => {
        const menuItem = menuItems.find(item => item.id === itemId);
        if (!menuItem) return null;
        
        return {
          id: itemId,
          type: 'dish',
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          quantity: quantity,
          restaurantId: menuItem.restaurantId,
          restaurantName: menuItem.restaurantName
        } as CartItem;
      }).filter(Boolean) as CartItem[];
      
      setFormattedCartItems(items);
    }
  }, [cartItems, menuItems]);
        price: "$14.99",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
        quantity: 2,
        restaurantId: "pizza-palace",
        restaurantName: "Pizza Palace"
      },
      {
        id: "garlic-bread",
        name: "Garlic Bread",
        type: 'dish',
        price: "$5.99",
        image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80",
        quantity: 1,
        restaurantId: "pizza-palace",
        restaurantName: "Pizza Palace"
      }
    ]);
  }, []);

  useEffect(() => {
    setCartItems(getCart());
  }, []);
  
  const handleCheckout = async () => {
    const currentCartItems = getCart();
    if (currentCartItems.length === 0) {
      alert("Votre panier est vide");
      return;
    }
    
    const orderPayload = {
      customerId: userId,
      restaurantId: currentCartItems[0].restaurantId,
      cost: currentCartItems.reduce((sum, item) => sum + item.quantity * Number(item.price.replace(/[^\d.-]/g, '')), 0),
      state: "pending",
      items: currentCartItems.map(item => ({
        id: item.id,
        type: item.type,
        quantity: item.quantity,
      })),
    };
    
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    if (response.ok) {
      clearCart();
      const { orderId } = await response.json();
      router.push(`/customer/order-confirmed/${orderId}`);
    } else {
      alert("Erreur: commande non envoyée.");
    }
  };
  
  const handleClearCart = () => {
    clearCart();
  };
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      // Remove item if quantity is 0
      removeFromCart(id);
    } else {
      // Update quantity by removing and adding the correct number of times
      const currentQuantity = getItemQuantity(id);
      if (newQuantity > currentQuantity) {
        // Add more items
        for (let i = 0; i < newQuantity - currentQuantity; i++) {
          addToCart(id);
        }
      } else {
        // Remove items
        for (let i = 0; i < currentQuantity - newQuantity; i++) {
          removeFromCart(id);
        }
      }
    }
  };
  
  const calculateSubtotal = () => {
    return formattedCartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };
  
  const getDeliveryFee = () => {
    return 2.99;
  };
  
  const getTaxes = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };
  
  const getTotal = () => {
    return calculateSubtotal() + getDeliveryFee() + getTaxes() - discount;
  };
  
  const handleSelectAddress = (address: string, lat?: number, lng?: number) => {
    setDeliveryAddress({ 
      ...deliveryAddress,
      address, 
      latitude: lat,
      longitude: lng
    });
    setShowLocationModal(false);
    setSearchQuery("");
  };
  
  const handleAddNewAddress = () => {
    if (selectionMethod === 'text') {
      // For text-based selection
      if (searchQuery.trim() !== "") {
        handleSelectAddress(searchQuery);
      } else {
        // Focus on the search input if it's empty
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    } else {
      // For map-based selection
      if (addressFromMap) {
        handleSelectAddress(addressFromMap, mapCoordinates[1], mapCoordinates[0]);
      }
    }
  };
  
  const switchSelectionMethod = (method: 'text' | 'map') => {
    setSelectionMethod(method);
    
    // Reset map when switching away from map view
    if (method === 'text' && map.current) {
      map.current.remove();
      map.current = null;
    }
  };
  
  if (formattedCartItems.length === 0) {
    return (
      <div className="bg-[#f8f9fa] min-h-svh">
        {/* Dark overlay for navbar */}
        <div className="fixed top-0 left-0 right-0 h-16 z-40 backdrop-blur-xs bg-linear-to-b from-black/60 via-black/40 to-transparent pointer-events-none" style={{ height: 90 }}></div>
        <CustomerNavbar />
        
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
          <div className="flex items-center mb-6" style={{ marginTop: 30 }} >
            <Link href="/customer" className="mr-4 bg-white p-2 rounded-full shadow-xs text-gray-700 hover:bg-gray-100 transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8 max-w-md">Looks like you haven't added any items to your cart yet. Explore our restaurants and discover delicious meals!</p>
              <div className="space-y-4 w-full max-w-xs">
                <Link href="/customer" className="bg-[#009E73] hover:bg-[#388E3C] text-white px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center w-full transition-colors">
                  Browse Restaurants
                </Link>
                <Link href="/customer/popular-restaurants" className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center w-full transition-colors">
                  Popular Restaurants
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-[#f8f9fa] min-h-svh pb-20">
      {/* Dark overlay for navbar */}
      <div className="fixed top-0 left-0 right-0 h-16 z-40 backdrop-blur-xs bg-linear-to-b from-black/60 via-black/40 to-transparent pointer-events-none"></div>
      <CustomerNavbar />
      
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-6">
        <div className="flex items-center mb-6" style={{ marginTop: 30 }} >
          <Link href="/customer" className="mr-4 bg-white p-2 rounded-full shadow-xs text-gray-700 hover:bg-gray-100 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="lg:w-7/12">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order from {formattedCartItems[0]?.restaurantName}</h2>
              
              <div className="space-y-4">
                {formattedCartItems.map((item) => (
                  <div key={item.id} className="flex border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden mr-4 shrink-0">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        width={80} 
                        height={80} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="grow">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-[#009E73] font-medium">{item.price}</p>
                    </div>
                    
                    <div className="flex items-center">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.type)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1 rounded-full"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-3 font-medium text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.type)}
                        className="bg-[#009E73] hover:bg-[#388E3C] text-white p-1 rounded-full"
                      >
                        <Plus size={16} />
                      </button>
                      <button 
                        onClick={() => removeItem(item.id, item.type)}
                        className="ml-4 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
                <button 
                  onClick={() => setShowLocationModal(true)}
                  className="text-[#009E73] font-medium hover:underline"
                >
                  Change
                </button>
              </div>
              
              <div className="flex items-start mb-4">
                <MapPin className="w-5 h-5 text-[#009E73] mt-1 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Delivery Address</h3>
                  <p className="text-gray-600">{deliveryAddress.address}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="delivery-instructions" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Instructions (optional)
                </label>
                <textarea
                  id="delivery-instructions"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
                  placeholder="E.g., Ring doorbell, leave at door, call upon arrival, etc."
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                />
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${selectedPaymentMethod === method.id ? 'border-[#009E73] bg-[#009E73]/5' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${selectedPaymentMethod === method.id ? 'border-[#009E73]' : 'border-gray-400'}">
                      {selectedPaymentMethod === method.id && (
                        <div className="w-3 h-3 rounded-full bg-[#009E73]"></div>
                      )}
                    </div>
                    
                    {method.type === "card" ? (
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-gray-700 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{method.cardType} •••• {method.lastFour}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-gray-700">
                          $
                        </div>
                        <p className="font-medium text-gray-900">Cash on Delivery</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">${getDeliveryFee().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium">${getTaxes().toFixed(2)}</span>
                </div>
                
                {promoCodeApplied && (
                  <div className="flex justify-between text-[#009E73]">
                    <span>Discount (WELCOME10)</span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Promo Code */}
              {!promoCodeApplied ? (
                <div className="mb-6">
                  <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="promo-code"
                      className="grow border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button
                      onClick={applyPromoCode}
                      className="bg-[#009E73] hover:bg-[#388E3C] text-white px-4 py-2 rounded-r-lg font-medium transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Try "WELCOME10" for 10% off your first order</p>
                </div>
              ) : (
                <div className="mb-6 bg-[#009E73]/10 p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-[#009E73] font-medium">WELCOME10</span>
                    <p className="text-xs text-gray-600">10% discount applied</p>
                  </div>
                  <button
                    onClick={() => {
                      setPromoCodeApplied(false);
                      setDiscount(0);
                      setPromoCode("");
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Estimated delivery time: 30-45 min</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-[#009E73] hover:bg-[#388E3C] text-white py-3 rounded-lg font-medium transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Location Change Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Change Delivery Address</h2>
              <button 
                onClick={() => {
                  setShowLocationModal(false);
                  setSearchQuery("");
                  if (map.current) {
                    map.current.remove();
                    map.current = null;
                  }
                }}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Selection Method Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                className={`flex-1 py-3 font-medium ${selectionMethod === 'text' ? 'text-[#009E73] border-b-2 border-[#009E73]' : 'text-gray-500'}`}
                onClick={() => switchSelectionMethod('text')}
              >
                Text Search
              </button>
              <button
                className={`flex-1 py-3 font-medium ${selectionMethod === 'map' ? 'text-[#009E73] border-b-2 border-[#009E73]' : 'text-gray-500'}`}
                onClick={() => switchSelectionMethod('map')}
              >
                Map Selection
              </button>
            </div>
            
            {selectionMethod === 'text' ? (
              <>
                <div className="p-4 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#009E73] focus:border-transparent"
                      placeholder="Search for an address"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="overflow-y-auto grow">
                  {filteredAddresses.length > 0 ? (
                    <div className="p-2">
                      {filteredAddresses.map((addr) => (
                        <div 
                          key={addr.id}
                          className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer flex items-start"
                          onClick={() => handleSelectAddress(addr.address, addr.latitude, addr.longitude)}
                        >
                          <MapPin className="w-5 h-5 text-[#009E73] mt-1 mr-3 shrink-0" />
                          <div>
                            <p className="text-gray-900">{addr.address}</p>
                          </div>
                          {addr.address === deliveryAddress.address && (
                            <Check className="ml-auto text-[#009E73]" size={18} />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <p>No addresses found matching your search.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">
                    Drag the marker or click on the map to set your delivery location.
                  </p>
                </div>
                
                <div className="grow overflow-hidden">
                  <div ref={mapContainer} className="w-full h-[300px]" />
                </div>
                
                <div className="p-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-900 mb-1">Selected Location:</p>
                  <p className="text-gray-600">{addressFromMap || "No location selected"}</p>
                </div>
              </>
            )}
            
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleAddNewAddress}
                className="w-full bg-[#009E73] hover:bg-[#388E3C] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <span>Confirm Location</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PaymentMethod {
  id: string;
  type: "card" | "cash";
  lastFour?: string;
  cardType?: string;
}
