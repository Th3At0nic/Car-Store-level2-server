import { z } from 'zod';
import { CarCategory } from './car.interface';

// Zod schema for car validation
export const carValidationSchema = z.object({
  body: z.object({
    brand: z.string().min(1, { message: 'Brand is required' }),
    model: z.string().min(1, { message: 'Model is required' }),
    year: z
      .number()
      .int({ message: 'Year must be an integer' })
      .min(1886, { message: 'Year must be 1886 or later' })
      .max(new Date().getFullYear(), {
        message: 'Year cannot be in the future',
      }),
    price: z.number().positive({ message: 'Price must be a positive number' }),
    category: z.nativeEnum(CarCategory, { message: 'Invalid car category' }),
    description: z.string().min(1, { message: 'Description is required' }),
    quantity: z
      .number()
      .int({ message: 'Quantity must be an integer' })
      .min(0, { message: 'Quantity cannot be negative' }),
    inStock: z.boolean({ required_error: 'In-stock status is required' }),
  }),
});

// Assuming CarCategory is already defined elsewhere
export const updateCarValidationSchema = z.object({
  body: z.object({
    brand: z.string().min(1, { message: 'Brand is required' }).optional(),
    model: z.string().min(1, { message: 'Model is required' }).optional(),
    year: z
      .number()
      .int({ message: 'Year must be an integer' })
      .min(1886, { message: 'Year must be 1886 or later' })
      .max(new Date().getFullYear(), {
        message: 'Year cannot be in the future',
      })
      .optional(),
    price: z
      .number()
      .positive({ message: 'Price must be a positive number' })
      .optional(),
    category: z
      .nativeEnum(CarCategory, { message: 'Invalid car category' })
      .optional(),
    description: z
      .string()
      .min(1, { message: 'Description is required' })
      .optional(),
    quantity: z
      .number()
      .int({ message: 'Quantity must be an integer' })
      .min(0, { message: 'Quantity cannot be negative' })
      .optional(),
    inStock: z
      .boolean({ required_error: 'In-stock status is required' })
      .optional(),
  }),
});
