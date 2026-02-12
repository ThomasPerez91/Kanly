import type { z } from 'zod'
import { ListBoardsSchema } from './schema'
import type { BoardPublic } from '~/lib/types/board_public'

export type InputType = z.infer<typeof ListBoardsSchema>

export type ReturnType = {
  boards: BoardPublic[]
}
