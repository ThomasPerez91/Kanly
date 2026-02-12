import { z } from 'zod'
import { BoardListUpdateSchema } from './schema'
import type { BoardListPublic } from '~/lib/types/board_list_public'

export type InputType = z.infer<typeof BoardListUpdateSchema>

export type ReturnType = {
  list: BoardListPublic
}
