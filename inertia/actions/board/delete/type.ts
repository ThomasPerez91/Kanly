import { z } from 'zod'
import { BoardDeleteSchema } from './schema'
import type { BoardDeleteResponse } from '~/lib/types/boards_action_response'

export type InputType = z.infer<typeof BoardDeleteSchema>
export type ReturnType = BoardDeleteResponse
