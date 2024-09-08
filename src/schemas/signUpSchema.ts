import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "username need minimum length of 4 characters")
  .max(15, "username must less then 15 characters")
  .regex(/^[a-zA-Z0-9]+$/, "don't use special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "please enter valid email address" }),
  password: z
    .string()
    .min(6, { message: "min 6 characters required" })
    .max(15, { message: "please use less than 15 characters" }),
});
