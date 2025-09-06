import {z} from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(3),
  password: z.string().min(6)
});

export const signInSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});