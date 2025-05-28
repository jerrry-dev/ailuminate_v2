import { z } from "zod"

export const sendMessageSchema = z.object({
  recipientId: z.string().min(1, { message: "Recipient is required" }),
  content: z
    .string()
    .min(1, { message: "Message cannot be empty" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
  fileIds: z.array(z.string()).optional(),
})

export type SendMessageInput = z.infer<typeof sendMessageSchema>
