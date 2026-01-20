import { z } from "zod";

export const RegisterSchema = z
  .object({
    fullName: z.string().min(2, "Please enter your name"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_verify: z.string().min(8, "Please confirm your password"),
  })
  .refine((v) => v.password === v.password_verify, {
    message: "Passwords do not match",
    path: ["password_verify"],
  });
