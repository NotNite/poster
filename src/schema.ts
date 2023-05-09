import { z } from "zod";

export const UserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  css: z.string().min(1).optional()
});

export const CreateCommentSchema = z.object({
  content: z.string().min(1),
  css: z.string().min(1).optional()
});
