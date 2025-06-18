import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../auth/auth-context';
import { LoginCredentials, LoginResponse } from '../schemas/auth.schema';

// Base API URL
const API_URL = '/api';

/**
 * Custom hook for login functionality
 */
export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      try {
        console.log('Attempting login with:', { email: credentials.email });
        
        console.log('Making login request to:', `${API_URL}/auth/login`);
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          console.error('Login failed with status:', response.status);
          const errorText = await response.text();
          console.error('Error response:', errorText);
          
          let errorData: { message?: string } = {};
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            console.error('Failed to parse error response as JSON');
          }
          
          throw new Error(errorData.message || `Login failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Login successful:', { userId: data.user?.userId, role: data.user?.role });
        return data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Store the token and user data in the auth context
      login(data.access_token, data.user);
    },
  });
};

/**
 * Helper function to get auth header with token
 */
export const getAuthHeader = (token: string | null) => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};
