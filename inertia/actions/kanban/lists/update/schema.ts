import { z } from 'zod'

export const BoardListUpdateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(80).optional(),
  position: z.number().optional(),
  visibility: z.string().optional(),
})
