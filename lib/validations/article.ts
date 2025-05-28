import { z } from "zod"

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  excerpt: z.string().max(200, { message: "Excerpt must be less than 200 characters" }).optional(),
  tags: z.array(z.string()).max(5, { message: "You can add up to 5 tags" }).optional(),
  thumbnail: z.string().url({ message: "Thumbnail must be a valid URL" }).optional(),
  status: z.enum(["draft", "published"]).default("draft"),
})

export const updateArticleSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must be less than 100 characters" })
    .optional(),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }).optional(),
  excerpt: z.string().max(200, { message: "Excerpt must be less than 200 characters" }).optional(),
  tags: z.array(z.string()).max(5, { message: "You can add up to 5 tags" }).optional(),
  thumbnail: z.string().url({ message: "Thumbnail must be a valid URL" }).optional(),
  status: z.enum(["draft", "published"]).optional(),
})

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Comment cannot be empty" })
    .max(500, { message: "Comment must be less than 500 characters" }),
})

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
export type CommentInput = z.infer<typeof commentSchema>
