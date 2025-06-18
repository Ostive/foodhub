import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../auth/auth-context';
import { LoginCredentials, LoginResponse } from '../schemas/auth.schema';

// Base API URL
// #TODO: Move this to a config file
const API_URL = '/api';

/**
 * Custom hook for login functionality
 */
export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      try {
        // Attempt to make the login request
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        }).catch((fetchError) => {
          // Handle network errors (offline, DNS failure, etc)
          throw new Error('Network error. Please check your internet connection.');
        });

        // If we got a response but it's not OK
        if (!response.ok) {
          let errorMessage = `Authentication failed (${response.status})`;
          
          try {
            // Try to parse the error response as JSON
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            // If we can't parse JSON, try to get the text
            try {
              const errorText = await response.text();
              if (errorText) errorMessage = errorText;
            } catch (textError) {
              // If we can't get text either, use the status code message
              errorMessage = `Authentication failed: ${response.statusText || response.status}`;
            }
          }
          
          throw new Error(errorMessage);
        }

        // Parse the successful response
        try {
          const data = await response.json();
          return data;
        } catch (parseError) {
          throw new Error('Invalid response from server. Please try again.');
        }
      } catch (error) {
        // Ensure we always throw an Error object with a message
        if (error instanceof Error) {
          throw error;
        } else {
          throw new Error('An unexpected error occurred during login.');
        }
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
