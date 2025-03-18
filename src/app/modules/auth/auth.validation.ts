import { z } from 'zod';

export const loginUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email({ message: 'A valid email address is required.' })
      .min(1, { message: 'Email is required.' }),
    password: z.string().min(1, { message: 'Password is required.' }),
  }),
});
