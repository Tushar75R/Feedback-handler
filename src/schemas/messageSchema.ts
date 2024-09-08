import { z } from "zod";

export const MessagesSchema = z.object({
  content: z
    .string()
    .min(10, { message: "content at least must be 10 characters" })
    .max(300, { message: "content at most must be 300 characters" }),
});
