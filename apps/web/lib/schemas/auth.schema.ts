import { z } from 'zod';

/**
 * User role schema
 */
export const UserRoleSchema = z.enum([
  'customer',
  'delivery_person',
  'restaurant',
  'developer',
  'manager',
  'admin'
]);

export type UserRole = z.infer<typeof UserRoleSchema>;

/**
 * User schema - common fields for all user types
 */
export const UserSchema = z.object({
  userId: z.number(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  role: UserRoleSchema,
});

export type User = z.infer<typeof UserSchema>;

/**
 * Login credentials schema
 */
export const LoginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

/**
 * Login response schema
 */
export const LoginResponseSchema = z.object({
  access_token: z.string(),
  user: UserSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/**
 * Auth token schema
 */
export const AuthTokenSchema = z.object({
  token: z.string(),
  expiresAt: z.number().optional(),
});

export type AuthToken = z.infer<typeof AuthTokenSchema>;
