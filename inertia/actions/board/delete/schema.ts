import { z } from 'zod'

export const BoardDeleteSchema = z.object({
  id: z.number().int().positive(),
})
