/**
 * Centralized schema exports
 * 
 * This file exports all schemas from the schema directory to make imports cleaner
 * throughout the application. Instead of importing from individual schema files,
 * you can import from 'lib/schemas'.
 */

// Auth schemas
export * from './auth.schema';

// User schemas
export * from './user.schema';

// Restaurant schemas
export * from './restaurant.schema';

// Order schemas
export * from './order.schema';

// Delivery schemas
export * from './delivery.schema';

// Payment schemas
export * from './payment.schema';
