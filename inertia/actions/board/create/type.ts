import { z } from 'zod'
import { BoardCreateSchema } from './schema'
import type { BoardCreateResponse } from '~/lib/types/boards_action_response'

export type InputType = z.infer<typeof BoardCreateSchema>
export type ReturnType = BoardCreateResponse
