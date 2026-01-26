import { z } from 'zod'
import { WorkspaceDeleteSchema } from './schema'
import type { WorkspaceDeleteResponse } from '~/lib/types/workspaces_action_response'

export type InputType = z.infer<typeof WorkspaceDeleteSchema>
export type ReturnType = WorkspaceDeleteResponse
