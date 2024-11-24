import { z } from 'zod';
import { Types } from 'mongoose';

// Defining a type for the error structure
export type ErrorType = {
  path: string[];
  message: string;
  code: string;
  minimum?: number;
};

//defining he type of accumulator in the reduce function/method in the orderController file
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
    value: number;
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
