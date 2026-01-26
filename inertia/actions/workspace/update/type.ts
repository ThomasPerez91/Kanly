import { z } from 'zod'
import { WorkspaceUpdateSchema } from './schema'
import type { WorkspaceUpdateResponse } from '~/lib/types/workspaces_action_response'

export type InputType = z.infer<typeof WorkspaceUpdateSchema>
export type ReturnType = WorkspaceUpdateResponse
