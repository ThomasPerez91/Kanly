import type { z } from 'zod'
import { ListBoardsSchema } from './schema'

export type InputType = z.infer<typeof ListBoardsSchema>
