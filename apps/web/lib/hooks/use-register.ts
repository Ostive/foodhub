import { useMutation } from '@tanstack/react-query';
import { RegisterCustomerData } from '../schemas/user.schema';

// Base API URL
const API_URL = '/api';

/**
 * Custom hook for customer registration
 */
export const useRegisterCustomer = () => {
  return useMutation({
    mutationFn: async (userData: RegisterCustomerData) => {
      try {
        console.log('Attempting to register customer:', { email: userData.email });
        
        const response = await fetch(`${API_URL}/user/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Registration failed:', errorData);
          throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();
        console.log('Registration successful:', { userId: data.userId });
        return data;
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    },
  });
};
