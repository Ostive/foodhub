/**
 * Server component that fetches user profile data
 * This is a server-only component that fetches data and passes it to the client
 */
export async function getProfileData(): Promise<{
  userData: any;
  paymentMethods: any[];
  notificationSettings: any[];
  error: string | null;
}> {
  try {
    // Fetch user data from API
    const userId = "current"; // In a real app, this would be the authenticated user's ID
    const response = await fetch(`${process.env.USER_SERVICE_URL}/api/users/${userId}`, {
      cache: "no-store", // Don't cache to ensure fresh data
      next: { revalidate: 60 } // Revalidate every minute as fallback
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }
    
    const userData = await response.json();
    
    // If we can't fetch from the API, fall back to mock data
    if (!userData) {
      return getMockProfileData();
    }
    
    // Try to fetch payment methods from API
    let paymentMethods = [];
    try {
      const paymentResponse = await fetch(`${process.env.USER_SERVICE_URL}/api/users/${userId}/payment-methods`, {
        cache: "no-store",
        next: { revalidate: 60 }
      });
      
      if (paymentResponse.ok) {
        paymentMethods = await paymentResponse.json();
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      // Fall back to mock payment methods
      paymentMethods = [
        {
          id: "pm1",
          type: "card" as const,
          name: "Visa ending in 4242",
          last4: "4242",
          expiry: "12/25",
          icon: "/images/payment/visa.svg"
        },
        {
          id: "pm2",
          type: "card" as const,
          name: "Mastercard ending in 5555",
          last4: "5555",
          expiry: "10/24",
          icon: "/images/payment/mastercard.svg"
        },
        {
          id: "pm3",
          type: "paypal" as const,
          name: "PayPal - john.doe@example.com",
          icon: "/images/payment/paypal.svg"
        }
      ];
    }
    
    // Mock notification settings
    const notificationSettings = [
      {
        id: "notif1",
        name: "Order Updates",
        description: "Get notified about your order status",
        enabled: true
      },
      {
        id: "notif2",
        name: "Promotions",
        description: "Receive special offers and discounts",
        enabled: false
      },
      {
        id: "notif3",
        name: "New Restaurants",
        description: "Be the first to know when new restaurants join",
        enabled: true
      },
      {
        id: "notif4",
        name: "Delivery Updates",
        description: "Get real-time updates about your delivery",
        enabled: true
      }
    ];
    
    return {
      userData,
      paymentMethods,
      notificationSettings,
      error: null
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return getMockProfileData(error instanceof Error ? error.message : "Failed to fetch profile data");
  }
}

/**
 * Helper function to get mock profile data when API fails
 */
function getMockProfileData(errorMessage: string | null = null): {
  userData: any;
  paymentMethods: any[];
  notificationSettings: any[];
  error: string | null;
} {
  // Mock user data
  const userData = {
    id: "user-123",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    avatar: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
  };
  
  // Mock payment methods
  const paymentMethods = [
    {
      id: "pm1",
      type: "card" as const,
      name: "Visa ending in 4242",
      last4: "4242",
      expiry: "12/25",
      icon: "/images/payment/visa.svg"
    },
    {
      id: "pm2",
      type: "card" as const,
      name: "Mastercard ending in 5555",
      last4: "5555",
      expiry: "10/24",
      icon: "/images/payment/mastercard.svg"
    },
    {
      id: "pm3",
      type: "paypal" as const,
      name: "PayPal - john.doe@example.com",
      icon: "/images/payment/paypal.svg"
    }
  ];
  
  // Mock notification settings
  const notificationSettings = [
    {
      id: "notif1",
      name: "Order Updates",
      description: "Get notified about your order status",
      enabled: true
    },
    {
      id: "notif2",
      name: "Promotions",
      description: "Receive special offers and discounts",
      enabled: false
    },
    {
      id: "notif3",
      name: "New Restaurants",
      description: "Be the first to know when new restaurants join",
      enabled: true
    },
    {
      id: "notif4",
      name: "Delivery Updates",
      description: "Get real-time updates about your delivery",
      enabled: true
    }
  ];
  
  return {
    userData,
    paymentMethods,
    notificationSettings,
    error: errorMessage
  };
}
