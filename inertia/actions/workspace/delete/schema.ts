import { z } from 'zod'

export const WorkspaceDeleteSchema = z.object({
  id: z.number().int().positive(),
})
