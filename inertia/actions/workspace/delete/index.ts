import { router } from '@inertiajs/react'
import { createSafeAction } from '~/lib/create_safe_action'
import { http } from '~/lib/http'
import { WorkspaceDeleteSchema } from './schema'
import type { InputType, ReturnType } from './type'

export const deleteWorkspaceAction = (csrfToken: string) =>
  createSafeAction<InputType, ReturnType>(WorkspaceDeleteSchema, async (data) => {
    const res = await http.delete<ReturnType>(`/workspaces/${data.id}`, { csrfToken })

    if (!res.ok) return { error: res.error }

    router.visit('/dashboard', { preserveScroll: true })
    return { data: res.data }
  })
