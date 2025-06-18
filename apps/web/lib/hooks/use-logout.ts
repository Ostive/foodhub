import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth/auth-context';
import { apiRequest } from '@/lib/api/api-client';

/**
 * Hook for handling user logout
 */
export const useLogout = () => {
  const { token, logout: authLogout } = useAuth();
  
  // Create a mutation for the logout API call
  const mutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Call the logout API endpoint
      const response = await apiRequest('auth', 'logout', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      
      return response;
    },
    onSuccess: () => {
      // Call the auth context logout function to clear state and localStorage
      authLogout();
    },
    onError: (error: Error) => {
      console.error('Logout failed:', error);
      // Even if the API call fails, we should still log the user out locally
      authLogout();
    },
  });
  
  return mutation;
};
