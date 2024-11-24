import { z } from 'zod';
import { Types } from 'mongoose';

// Define a type for the error structure
export type ErrorType = {
  path: string[];
  message: string;
  code: string;
  minimum?: number; // Optional, as it might not always be present
};

export type AccType = {
  [key: string]: {
    message: string;
    name: string;
    properties: {
      message: string;
      type: string;
      min?: number;
    };
    kind: string;
    path: string;
    value: number; // This is the value causing the error (like `req.body.order.totalPrice`)
  };
};

// Schema for validating a MongoDB ObjectId
const objectIdSchema = z.string().refine((id) => Types.ObjectId.isValid(id), {
  message: 'Invalid ObjectId format',
});

// Schema for validating the structure of an order
export const orderValidationSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  car: objectIdSchema,
  quantity: z
    .number()
    .positive({ message: 'Quantity must be a positive number' }),
  totalPrice: z
    .number()
    .positive({ message: 'Total price must be a positive number' }),
});
