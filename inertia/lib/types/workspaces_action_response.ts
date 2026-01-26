import type { WorkspacePublic } from '~/lib/types/workspace_public'

export type WorkspaceCreateResponse = {
  workspace: WorkspacePublic
}

export type WorkspaceUpdateResponse = {
  workspace: WorkspacePublic
}

export type WorkspaceDeleteResponse = {
  ok: true
}
