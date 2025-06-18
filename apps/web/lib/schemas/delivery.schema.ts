import { z } from 'zod';
import { OrderStatusSchema } from './order.schema';

/**
 * Delivery status schema
 */
export const DeliveryStatusSchema = z.enum([
  'pending',
  'assigned',
  'picked_up',
  'in_transit',
  'delivered',
  'failed',
  'cancelled',
]);

export type DeliveryStatus = z.infer<typeof DeliveryStatusSchema>;

/**
 * Vehicle type schema
 */
export const VehicleTypeSchema = z.enum([
  'car',
  'motorcycle',
  'bicycle',
  'scooter',
  'on_foot',
]);

export type VehicleType = z.infer<typeof VehicleTypeSchema>;

/**
 * Delivery person schema
 */
export const DeliveryPersonSchema = z.object({
  id: z.number(),
  userId: z.number(),
  firstName: z.string(),
  lastName: z.string().optional(),
  phone: z.string(),
  email: z.string().email(),
  vehicleType: VehicleTypeSchema,
  licenseNumber: z.string().optional(),
  isActive: z.boolean().default(true),
  currentLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  rating: z.number().min(0).max(5).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type DeliveryPerson = z.infer<typeof DeliveryPersonSchema>;

/**
 * Delivery assignment schema
 */
export const DeliveryAssignmentSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  deliveryPersonId: z.number(),
  status: DeliveryStatusSchema,
  pickupTime: z.string().optional(),
  deliveryTime: z.string().optional(),
  estimatedArrivalTime: z.string().optional(),
  actualArrivalTime: z.string().optional(),
  distance: z.number().optional(), // in kilometers
  route: z.array(
    z.object({
      latitude: z.number(),
      longitude: z.number(),
      timestamp: z.string().optional(),
    })
  ).optional(),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type DeliveryAssignment = z.infer<typeof DeliveryAssignmentSchema>;

/**
 * Delivery tracking update schema
 */
export const DeliveryTrackingUpdateSchema = z.object({
  id: z.number().optional(),
  deliveryId: z.number(),
  status: DeliveryStatusSchema,
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  timestamp: z.string(),
  notes: z.string().optional(),
});

export type DeliveryTrackingUpdate = z.infer<typeof DeliveryTrackingUpdateSchema>;

/**
 * Delivery rating schema
 */
export const DeliveryRatingSchema = z.object({
  id: z.number().optional(),
  deliveryId: z.number(),
  customerId: z.number(),
  deliveryPersonId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.string().optional(),
});

export type DeliveryRating = z.infer<typeof DeliveryRatingSchema>;
