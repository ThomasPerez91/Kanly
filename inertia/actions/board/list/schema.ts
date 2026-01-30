import { z } from 'zod'

export const BoardListSchema = z.object({
  workspaceId: z.number().int().positive(),
})
