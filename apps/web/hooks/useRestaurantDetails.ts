"use client";

import { useState, useEffect } from 'react';
import { Restaurant } from './useRestaurants';

export function useRestaurantDetails(restaurantId: string | undefined) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      if (!restaurantId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Connect frontend [restaurantId] with API [id] route
        const response = await fetch(`/api/restaurant/${restaurantId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch restaurant details');
        }
        
        const data = await response.json();
        setRestaurant(data);
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
        setError('Failed to load restaurant details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantDetails();
  }, [restaurantId]);

  return { restaurant, loading, error };
}
