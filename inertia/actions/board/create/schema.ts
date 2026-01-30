import { z } from 'zod'

export const BoardCreateSchema = z.object({
  workspaceId: z.number().int().positive(),

  name: z.string().min(1, { error: 'Please enter a board name' }).max(150),
  type: z.enum(['kanban', 'table', 'roadmap', 'calendar']),

  backgroundUrl: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine(
      (v) => {
        if (!v) return true
        return /^https?:\/\/.+/i.test(v)
      },
      { error: 'Please enter a valid URL (http/https)' }
    ),
})
