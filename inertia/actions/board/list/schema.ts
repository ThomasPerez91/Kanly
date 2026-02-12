import { z } from 'zod'

export const ListBoardsSchema = z.object({
  workspaceId: z.number().int().positive(),
})
