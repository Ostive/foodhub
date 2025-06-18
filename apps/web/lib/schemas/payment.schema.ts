import { z } from 'zod';
import { PaymentMethodSchema, PaymentStatusSchema } from './order.schema';

/**
 * Payment schema
 */
export const PaymentSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  customerId: z.number(),
  amount: z.number().positive(),
  method: PaymentMethodSchema,
  status: PaymentStatusSchema,
  transactionId: z.string().optional(),
  paymentIntentId: z.string().optional(),
  receiptUrl: z.string().optional(),
  refundId: z.string().optional(),
  refundAmount: z.number().optional(),
  refundReason: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Payment = z.infer<typeof PaymentSchema>;

/**
 * Payment method details schema
 */
export const PaymentMethodDetailsSchema = z.object({
  id: z.number().optional(),
  customerId: z.number(),
  type: PaymentMethodSchema,
  isDefault: z.boolean().default(false),
  // Credit/debit card details
  cardLast4: z.string().length(4).optional(),
  cardBrand: z.string().optional(),
  cardExpiryMonth: z.string().optional(),
  cardExpiryYear: z.string().optional(),
  cardholderName: z.string().optional(),
  // PayPal details
  paypalEmail: z.string().email().optional(),
  // External payment method token (for payment processor)
  paymentMethodToken: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type PaymentMethodDetails = z.infer<typeof PaymentMethodDetailsSchema>;

/**
 * Create payment intent schema
 */
export const CreatePaymentIntentSchema = z.object({
  orderId: z.number(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  paymentMethod: PaymentMethodSchema,
  customerId: z.number(),
  description: z.string().optional(),
});

export type CreatePaymentIntent = z.infer<typeof CreatePaymentIntentSchema>;

/**
 * Refund request schema
 */
export const RefundRequestSchema = z.object({
  paymentId: z.number(),
  amount: z.number().positive(),
  reason: z.string(),
});

export type RefundRequest = z.infer<typeof RefundRequestSchema>;
