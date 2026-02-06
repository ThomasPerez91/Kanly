import { useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import type { SharedProps } from '~/lib/types/shared_props'
import type { UseWorkspacesReturn } from './use_workspaces_type'

export const useWorkspaces = (): UseWorkspacesReturn => {
  const { workspaces, activeWorkspaceId } = usePage<SharedProps>().props

  const safeWorkspaces: Array<unknown> = Array.isArray(workspaces) ? workspaces : []
  const safeActiveId = activeWorkspaceId ?? null

  return useMemo(
    () =>
      ({
        workspaces: safeWorkspaces,
        activeWorkspaceId: safeActiveId,
        hasWorkspace: safeWorkspaces.length > 0 && safeActiveId !== null,
      }) as UseWorkspacesReturn,
    [safeWorkspaces, safeActiveId]
  )
}
