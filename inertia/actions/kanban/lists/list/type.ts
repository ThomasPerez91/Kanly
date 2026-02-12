import type { z } from 'zod'
import type { BoardListPublic } from '~/lib/types/board_list_public'
import { ListKanbanListsSchema } from './schema'

export type InputType = z.infer<typeof ListKanbanListsSchema>

export type ReturnType = {
  lists: BoardListPublic[]
}
