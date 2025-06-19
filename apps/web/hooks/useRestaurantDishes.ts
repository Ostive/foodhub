"use client";

import { useState, useEffect } from 'react';

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  ingredients?: string[];
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  preparationTime?: string;
  calories?: number;
  restaurantId: number;
  createdAt: string;
  updatedAt: string;
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
        setDishes(data);
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
