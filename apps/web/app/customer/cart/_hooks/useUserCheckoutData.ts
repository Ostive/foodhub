'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';

export function useUserCheckoutData() {
  const { isAuthenticated, user } = useAuth();
  
  // State for fetched data
  const [fetchedAddresses, setFetchedAddresses] = useState<any[]>([]);
  const [fetchedPaymentMethods, setFetchedPaymentMethods] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch user data when authenticated
  useEffect(() => {
    async function fetchUserData() {
      if (isAuthenticated && user) {
        setIsFetching(true);
        setFetchError(null);
        
        try {
          const cookies = document.cookie.split(';');
          const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
          const authToken = authTokenCookie ? authTokenCookie.split('=')[1] : '';
          if (!authToken) {
            setFetchError('Authentication error');
            setIsFetching(false);
            return;
          }
          
          const tokenParts = authToken.split('.');
          if (tokenParts.length !== 3) {
            setFetchError('Invalid authentication token');
            setIsFetching(false);
            return;
          }
          
          const payload = JSON.parse(atob(tokenParts[1]));
          const userEmail = payload.email;
          if (!userEmail) {
            setFetchError('User email not found');
            setIsFetching(false);
            return;
          }
          
          const userResponse = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/users/customers/email/${userEmail}`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          
          if (!userResponse.ok) {
            setFetchError('Failed to fetch user data');
            setIsFetching(false);
            return;
          }
          
          const userData = await userResponse.json();
          const userId = userData.userId || userData.id;
          if (!userId) {
            setFetchError('User ID not found');
            setIsFetching(false);
            return;
          }
          
          console.log('Fetching data for user ID:', userId);
          
          // First use credit cards from user data if available
          if (userData && userData.creditCards && userData.creditCards.length > 0) {
            console.log('Using credit cards from user data:', userData.creditCards);
            
            // Transform credit cards into payment methods format
            const paymentMethodsData = userData.creditCards.map((card: any) => ({
              id: card.creditCardId.toString(),
              cardNumber: card.creditCardNumber,
              expiryDate: card.expiryDate,
              cardholderName: card.name,
              isDefault: false // No default flag in the data, could set first one as default
            }));
            
            setFetchedPaymentMethods(paymentMethodsData);
            
            // Set the first payment method as selected
            if (paymentMethodsData.length > 0) {
              setSelectedPayment(paymentMethodsData[0].id);
            }
          }
          
          // The API response contains a string address field we can use
          if (userData && userData.address) {
            console.log('Using address from user data:', userData.address);
            
            // Extract street, zipcode, and city from the address string
            // Assuming format like "123 Main St, 75001 Paris" or similar
            let street = '';
            let zipCode = '';
            let city = '';
            
            // Try to extract zipcode using regex
            const zipCodeMatch = userData.address.match(/\b\d{5}\b/);
            zipCode = zipCodeMatch ? zipCodeMatch[0] : '';
            
            // Extract street (everything before the zipcode)
            if (zipCodeMatch) {
              const addressParts = userData.address.split(zipCodeMatch[0]);
              street = addressParts[0].trim().replace(/,\s*$/, ''); // Remove trailing comma
              
              // Extract city (everything after the zipcode)
              if (addressParts[1]) {
                city = addressParts[1].trim().replace(/^,\s*/, ''); // Remove leading comma
              }
            } else {
              // If no zipcode found, just use the whole string as street
              street = userData.address;
            }
            
            console.log('Extracted address parts:', { street, zipCode, city });
            
            const addressData = [{
              id: 'default',
              address: userData.address,
              fullAddress: userData.address,
              street: street,
              city: city,
              zipCode: zipCode,
              isDefault: true
            }];
            
            console.log('Formatted address data for UI:', addressData);
            setFetchedAddresses(addressData);
            setSelectedAddress('default');
          } else {
            console.log('No address found in user data:', userData);
          }
          
        } catch (error) {
          console.error('Error fetching user data:', error);
          setFetchError('Error fetching your data. Please try again.');
        } finally {
          setIsFetching(false);
        }
      }
    }
    
    fetchUserData();
  }, [isAuthenticated, user]);

  return {
    fetchedAddresses,
    fetchedPaymentMethods,
    selectedAddress,
    selectedPayment,
    isFetching,
    fetchError,
    setSelectedAddress,
    setSelectedPayment
  };
}
