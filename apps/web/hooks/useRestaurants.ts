import { useState, useEffect } from 'react';

export interface Restaurant {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  profilePicture?: string;
  cuisineType?: string;
  priceRange?: string;
  rating?: number;
  description?: string;
  averagePreparationTime?: string;
}

/**
 * Hook for fetching all restaurants or filtering by criteria
 */
export function useRestaurants(filters?: {
  cuisineType?: string;
  priceRange?: string;
  rating?: string;
}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        
        // Build query string with any provided filters
        const queryParams = new URLSearchParams();
        if (filters?.cuisineType) queryParams.append('cuisineType', filters.cuisineType);
        if (filters?.priceRange) queryParams.append('priceRange', filters.priceRange);
        if (filters?.rating) queryParams.append('rating', filters.rating);
        
        // Fetch restaurants from API
        // Make sure to use the correct API endpoint
        const url = `/api/restaurant${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        console.log('Fetching restaurants from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error('Restaurant API response not OK:', response.status, response.statusText);
          throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Restaurants data received:', data);
        
        // Check if data is an array
        if (!Array.isArray(data)) {
          console.warn('Restaurant data is not an array:', data);
          // If data is not an array but has a property that might contain restaurants
          if (data && typeof data === 'object') {
            // Try to find an array property
            const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
            if (possibleArrays.length > 0) {
              setRestaurants(possibleArrays[0] as Restaurant[]);
            } else {
              setRestaurants([]);
            }
          } else {
            setRestaurants([]);
          }
        } else {
          setRestaurants(data);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
        console.error('Error fetching restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [filters?.cuisineType, filters?.priceRange, filters?.rating]);

  return { restaurants, loading, error };
}
