import type { z } from 'zod'
import type { BoardListPublic } from '~/lib/types/board_list_public'
import { GenerateKanbanListsSchema } from './schema'

export type InputType = z.infer<typeof GenerateKanbanListsSchema>

export type ReturnType = {
  lists: BoardListPublic[]
}
