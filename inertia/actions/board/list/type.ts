import { z } from 'zod'
import { BoardListSchema } from './schema'
import type { BoardsIndexResponse } from '~/lib/types/boards_action_response'

export type InputType = z.infer<typeof BoardListSchema>
export type ReturnType = BoardsIndexResponse
