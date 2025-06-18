import { z } from 'zod';

/**
 * Restaurant schema
 */
export const RestaurantSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  address: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  cuisineType: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']).optional(),
  openingHours: z.string().optional(),
  imageUrl: z.string().url().optional(),
  ownerId: z.number().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Restaurant = z.infer<typeof RestaurantSchema>;

/**
 * Menu category schema
 */
export const MenuCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  restaurantId: z.number(),
  displayOrder: z.number().optional(),
});

export type MenuCategory = z.infer<typeof MenuCategorySchema>;

/**
 * Menu item schema
 */
export const MenuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  categoryId: z.number(),
  restaurantId: z.number(),
  isAvailable: z.boolean().default(true),
  isPopular: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  spicyLevel: z.enum(['not_spicy', 'mild', 'medium', 'hot', 'very_hot']).optional(),
  allergens: z.array(z.string()).optional(),
  nutritionalInfo: z.record(z.string(), z.string()).optional(),
  preparationTime: z.number().optional(), // in minutes
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

/**
 * Restaurant review schema
 */
export const RestaurantReviewSchema = z.object({
  id: z.number(),
  restaurantId: z.number(),
  userId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.string().optional(),
});

export type RestaurantReview = z.infer<typeof RestaurantReviewSchema>;
