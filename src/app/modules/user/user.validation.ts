import { z } from 'zod';

// Define Zod validation schema
export const UserValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(100, { message: 'Name must be 100 characters or fewer' })
      .trim(), // Trims leading and trailing whitespace
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(4, { message: 'Password must be at least 4 characters long' })
      .max(128, { message: 'Password must be 128 characters or fewer' }),
  }),
});
