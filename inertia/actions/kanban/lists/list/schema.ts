import { z } from 'zod'

export const ListKanbanListsSchema = z.object({
  boardId: z.number().int().positive(),
})
