import { z } from 'zod';
import mongoose from 'mongoose';

// Schema for validating a MongoDB ObjectId
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  })
  .transform((val) => new mongoose.Types.ObjectId(val));

// Schema for validating the structure of an order
export const orderValidationSchema = z.object({
  body: z.object({
    car: objectIdSchema,
    quantity: z
      .number()
      .positive({ message: 'Quantity must be a positive number' }),
  }),
});

// Schema for validating the structure of an order
export const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    orderStatus: z.enum(['PROCESSING', 'SHIPPED', 'DELIVERED'], {
      errorMap: () => ({
        message: 'Status must be one of: PROCESSING, SHIPPED, or DELIVERED',
      }),
    }),
  }),
});
