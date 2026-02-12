import { z } from 'zod'

export const GenerateKanbanListsSchema = z.object({
  boardId: z.number().int().positive(),
  mode: z.enum(['default', 'custom']),
  lists: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
      })
    )
    .optional(),
})
