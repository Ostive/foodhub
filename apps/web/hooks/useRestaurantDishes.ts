"use client";

import { useState, useEffect } from 'react';

export interface Dish {
  dishId: number;
  name: string;
  description: string;
  cost: number; // API returns cost instead of price
  picture?: string; // API returns picture instead of image
  tags?: string[]; // API returns tags instead of category
  additionalAllergens?: string[] | null;
  isVegetarian?: boolean;
  isSoldAlone?: boolean;
  spicyLevel?: number;
  userId: number; // This is the restaurantId in the API
  promo?: any | null;
  restaurant?: {
    id: number;
    name: string;
    email: string;
  };
}

export function useRestaurantDishes(restaurantId: string | undefined) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      if (!restaurantId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Connect frontend [restaurantId] with API [id]/dishes route
        const response = await fetch(`/api/restaurant/${restaurantId}/dishes`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch dishes');
        }
        
        const data = await response.json();
        console.log('API Response from hook:', data);
        
        // Handle nested response structure where dishes are in a 'dishes' property
        if (data && data.dishes && Array.isArray(data.dishes)) {
          console.log('Found dishes array in response:', data.dishes.length);
          setDishes(data.dishes);
        } else if (Array.isArray(data)) {
          console.log('Response is an array:', data.length);
          setDishes(data);
        } else {
          console.log('Unexpected response format:', typeof data);
          setDishes([]);
        }
      } catch (err) {
        console.error('Error fetching dishes:', err);
        setError('Failed to load dishes');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDishes();
  }, [restaurantId]);

  return { dishes, loading, error };
}
