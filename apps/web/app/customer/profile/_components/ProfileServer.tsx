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
    // Get the auth token from cookies if available
    // Using the correct pattern for Next.js cookies in Server Components
    const cookieStore = await (await import('next/headers')).cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    if (!authToken) {
      console.log('No authentication token found, using mock data');
      return getMockProfileData('No authentication token found');
    }
    
    // First, decode the JWT token to get the user information
    // This is a simple way to extract the payload without verification
    const tokenParts = authToken.split('.');
    if (tokenParts.length !== 3) {
      console.log('Invalid token format, using mock data');
      return getMockProfileData('Invalid token format');
    }
    
    // Decode the payload part (second part) of the JWT
    let userData;
    let userId;
    
    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log('JWT payload:', payload); // Log the payload to see its structure
      
      // Extract email from the JWT token
      const userEmail = payload.email;
      
      if (!userEmail) {
        console.log('No email found in token, using mock data');
        return getMockProfileData('No email found in token');
      }
      
      // Fetch user data from users service using the email
      const response = await fetch(`${process.env.USER_SERVICE_URL}/api/users/customers/email/${userEmail}`, {
        cache: "no-store",
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      });
      
      if (!response.ok) {
        console.log(`Failed to fetch user data: ${response.statusText}, using mock data`);
        return getMockProfileData(`Failed to fetch user data: ${response.statusText}`);
      }
      
      userData = await response.json();
      userId = userData.userId || userData.id;
      
      if (!userData) {
        console.log('No user data returned from API, using mock data');
        return getMockProfileData('No user data returned from API');
      }
    } catch (error) {
      console.error('Error decoding token or fetching user data:', error);
      return getMockProfileData(error instanceof Error ? error.message : 'Error fetching user data');
    }
    
    // Try to fetch payment methods from API using the user ID
    let paymentMethods = [];
    try {
      // Get the user ID from the userData response
      const userId = userData.userId || userData.id;
      
      if (userId) {
        const paymentResponse = await fetch(`${process.env.USER_SERVICE_URL}/api/users/customers/${userId}/payment-methods`, {
          cache: "no-store",
          next: { revalidate: 60 },
          headers: {
            'Authorization': `Bearer ${authToken}`,
          }
        });
        
        if (paymentResponse.ok) {
          paymentMethods = await paymentResponse.json();
        }
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
