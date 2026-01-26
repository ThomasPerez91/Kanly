import { z } from 'zod'

export const WorkspaceCreateSchema = z.object({
  name: z.string().min(2, { error: 'Please enter a workspace name' }),
  avatarUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine(
      (v) => {
        if (!v) return true
        return /^https?:\/\/.+/i.test(v) || /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(v)
      },
      { error: 'Please enter a valid URL (http/https) or a valid data:image base64' }
    ),
})
