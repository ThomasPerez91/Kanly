import { z } from 'zod'
import { WorkspaceCreateSchema } from './schema'
import type { WorkspaceCreateResponse } from '~/lib/types/workspace_action_response'

export type InputType = z.infer<typeof WorkspaceCreateSchema>
export type ReturnType = WorkspaceCreateResponse
