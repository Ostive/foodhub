import { z } from 'zod';
import { UserRoleSchema } from './auth.schema';

/**
 * Base user registration schema with common fields
 */
const BaseRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

/**
 * Customer registration schema
 */
export const RegisterCustomerSchema = BaseRegistrationSchema.extend({
  address: z.string().optional(),
  referralCode: z.string().optional(),
});

export type RegisterCustomerData = z.infer<typeof RegisterCustomerSchema>;

/**
 * Restaurant owner registration schema
 */
export const RegisterRestaurantOwnerSchema = BaseRegistrationSchema.extend({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  businessAddress: z.string().min(1, "Business address is required"),
  businessPhone: z.string().min(1, "Business phone is required"),
  cuisineType: z.string().optional(),
  businessLicense: z.string().optional(),
});

export type RegisterRestaurantOwnerData = z.infer<typeof RegisterRestaurantOwnerSchema>;

/**
 * Delivery person registration schema
 */
export const RegisterDeliveryPersonSchema = BaseRegistrationSchema.extend({
  vehicleType: z.enum(['car', 'motorcycle', 'bicycle', 'scooter', 'on_foot']),
  licenseNumber: z.string().optional(),
  idProof: z.string().optional(),
});

export type RegisterDeliveryPersonData = z.infer<typeof RegisterDeliveryPersonSchema>;

/**
 * Customer profile schema
 */
export const CustomerProfileSchema = z.object({
  userId: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.literal('customer'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type CustomerProfile = z.infer<typeof CustomerProfileSchema>;
