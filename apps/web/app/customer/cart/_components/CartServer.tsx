/**
 * Server component that provides cart page data
 * Since users don't need to be logged in to view their cart,
 * we'll use mock data for addresses and payment methods
 * and only fetch real data if the user is authenticated
 */
export async function getCartPageData(): Promise<{
  addressSuggestions: any[];
  paymentMethods: any[];
  error: string | null;
}> {
  try {
    // For now, we'll use mock data since users don't need to be logged in to view cart
    // In a real app, you would check if the user is authenticated and fetch their data if they are
    
    // Mock address suggestions that would be shown when user proceeds to checkout
    const addressSuggestions = [
      {
        id: "addr1",
        name: "Home",
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
        isDefault: true
      },
      {
        id: "addr2",
        name: "Work",
        street: "456 Market St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94103",
        country: "USA",
        isDefault: false
      }
    ];
    
    // Mock payment methods that would be shown when user proceeds to checkout
    const paymentMethods = [
      {
        id: "pm1",
        type: "credit_card",
        name: "Visa ending in 4242",
        expiryDate: "12/25",
        isDefault: true
      },
      {
        id: "pm2",
        type: "credit_card",
        name: "Mastercard ending in 5555",
        expiryDate: "10/24",
        isDefault: false
      },
      {
        id: "pm3",
        type: "paypal",
        name: "PayPal - john.doe@example.com",
        isDefault: false
      }
    ];
    
    return {
      addressSuggestions,
      paymentMethods,
      error: null
    };
  } catch (error) {
    console.error("Error in cart data:", error);
    return {
      addressSuggestions: [],
      paymentMethods: [],
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Helper function to get mock cart data when API fails
 */
function getMockCartData(errorMessage: string | null = null): {
  addressSuggestions: any[];
  paymentMethods: any[];
  error: string | null;
} {
  // Mock address suggestions
  const addressSuggestions = [
    {
      id: "addr1",
      address: "123 Main St, New York, NY 10001",
      label: "Home"
    },
    {
      id: "addr2",
      address: "456 Park Ave, New York, NY 10022",
      label: "Work"
    },
    {
      id: "addr3",
      address: "789 Broadway, New York, NY 10003",
      label: "Other"
    }
  ];
  
  // Mock payment methods
  const paymentMethods = [
    {
      id: "pm1",
      type: "card",
      name: "Visa ending in 4242",
      last4: "4242",
      expiry: "12/25",
      icon: "/images/payment/visa.svg"
    },
    {
      id: "pm2",
      type: "card",
      name: "Mastercard ending in 5555",
      last4: "5555",
      expiry: "10/24",
      icon: "/images/payment/mastercard.svg"
    },
    {
      id: "pm3",
      type: "paypal",
      name: "PayPal - john.doe@example.com",
      icon: "/images/payment/paypal.svg"
    }
  ];
  
  return {
    addressSuggestions,
    paymentMethods,
    error: errorMessage
  };
}
