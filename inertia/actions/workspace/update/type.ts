import { z } from 'zod'
import { WorkspaceUpdateSchema } from './schema'
import type { WorkspaceUpdateResponse } from '~/lib/types/workspace_action_response'

export type InputType = z.infer<typeof WorkspaceUpdateSchema>
export type ReturnType = WorkspaceUpdateResponse
