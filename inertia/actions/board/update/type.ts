import { z } from 'zod'
import { BoardUpdateSchema } from './schema'
import type { BoardUpdateResponse } from '~/lib/types/boards_action_response'

export type InputType = z.infer<typeof BoardUpdateSchema>
export type ReturnType = BoardUpdateResponse
