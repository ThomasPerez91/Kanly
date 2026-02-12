import { z } from 'zod'

export const BoardUpdateSchema = z
  .object({
    id: z.number().int().positive(),

    name: z.string().min(1, { error: 'Please enter a board name' }).max(150).optional(),
    type: z.enum(['kanban', 'table', 'roadmap', 'calendar']).optional(),

    backgroundUrl: z
      .string()
      .trim()
      .optional()
      .nullable()
      .refine(
        (v) => {
          if (v === undefined) return true
          if (!v) return true
          return /^https?:\/\/.+/i.test(v)
        },
        { error: 'Please enter a valid URL (http/https)' }
      ),
    archived: z.boolean().optional(),
  })
  .refine(
    (d) =>
      d.name !== undefined ||
      d.type !== undefined ||
      d.backgroundUrl !== undefined ||
      d.archived !== undefined,
    {
      error: 'Please provide at least one field to update',
    }
  )
