import { z } from 'zod'

export const RegisterSchema = z
  .object({
    fullName: z.string().min(2, { error: 'Please enter your name' }),
    email: z.email({ error: 'Invalid email address' }),
    password: z.string().min(8, { error: 'Password must be at least 8 characters' }),
    password_verify: z.string().min(8, { error: 'Please confirm your password' }),
  })
  .refine((v) => v.password === v.password_verify, {
    message: 'Passwords do not match',
    path: ['password_verify'],
  })
