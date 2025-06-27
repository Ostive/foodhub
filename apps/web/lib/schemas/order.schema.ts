import { z } from 'zod';

/**
 * Order status schema
 */
export const OrderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered',
  'cancelled',
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

/**
 * Order item schema
 */
export const OrderItemSchema = z.object({
  id: z.number().optional(),
  menuItemId: z.number(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().positive(),
  specialInstructions: z.string().optional(),
  options: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      price: z.number().optional(),
    })
  ).optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

/**
 * Payment method schema
 */
export const PaymentMethodSchema = z.enum([
  'credit_card',
  'debit_card',
  'paypal',
  'cash',
  'wallet',
]);

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

/**
 * Payment status schema
 */
export const PaymentStatusSchema = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
]);

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

/**
 * Order schema
 */
export const OrderSchema = z.object({
  id: z.number().optional(),
  customerId: z.number(),
  restaurantId: z.number(),
  items: z.array(OrderItemSchema),
  subtotal: z.number().positive(),
  tax: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  tip: z.number().nonnegative().optional(),
  discount: z.number().nonnegative().optional(),
  total: z.number().positive(),
  status: OrderStatusSchema,
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema,
  deliveryAddress: z.string(),
  deliveryInstructions: z.string().optional(),
  estimatedDeliveryTime: z.string().optional(),
  actualDeliveryTime: z.string().optional(),
  deliveryPersonId: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Order = z.infer<typeof OrderSchema>;

/**
 * Personalization choice schema
 */
export const PersonalizationChoiceSchema = z.object({
  optionId: z.number(),
  choiceIds: z.array(z.number())
});

/**
 * Order dish schema
 */
export const OrderDishSchema = z.object({
  dishId: z.number(),
  quantity: z.number().positive(),
  price: z.number().optional(),
  personalizationChoices: z.array(PersonalizationChoiceSchema).optional()
});

/**
 * Order menu schema
 */
export const OrderMenuSchema = z.object({
  menuId: z.number(),
  quantity: z.number().positive(),
  price: z.number().optional()
});

/**
 * Create order schema (for order creation)
 */
export const CreateOrderSchema = z.object({
  customerId: z.number(),
  restaurantId: z.number(),
  deliveryLocalisation: z.string(),
  time: z.string().optional(),
  cost: z.number().optional(),
  deliveryFee: z.number().optional(),
  status: z.string().optional(),
  dishes: z.array(OrderDishSchema),
  menus: z.array(OrderMenuSchema).optional(),
  // Legacy fields for backward compatibility
  cartItems: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      quantity: z.number().positive(),
      specialInstructions: z.string().optional()
    })
  ).optional(),
  // Additional frontend-specific fields
  paymentMethod: PaymentMethodSchema.optional(),
  deliveryInstructions: z.string().optional(),
  tip: z.number().nonnegative().optional(),
  promoCode: z.string().optional(),
});

export type CreateOrder = z.infer<typeof CreateOrderSchema>;

/**
 * Order dish type
 */
export type OrderDish = z.infer<typeof OrderDishSchema>;

/**
 * Order menu type
 */
export type OrderMenu = z.infer<typeof OrderMenuSchema>;

/**
 * Personalization choice type
 */
export type PersonalizationChoice = z.infer<typeof PersonalizationChoiceSchema>;
