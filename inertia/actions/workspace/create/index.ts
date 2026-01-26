import { router } from '@inertiajs/react'
import { createSafeAction } from '~/lib/create_safe_action'
import { http } from '~/lib/http'
import { WorkspaceCreateSchema } from './schema'
import type { InputType, ReturnType } from './type'

type BackendValidationErrors = {
  errors?: Record<string, string[]>
  message?: string
}

export const createWorkspaceAction = (csrfToken: string) =>
  createSafeAction<InputType, ReturnType>(WorkspaceCreateSchema, async (data) => {
    const payload = {
      name: data.name.trim(),
      avatarUrl: (data.avatarUrl ?? null) ? String(data.avatarUrl).trim() : null,
    }

    const res = await http.post<ReturnType, typeof payload>('/workspaces', payload, {
      csrfToken,
    })

    if (!res.ok) {
      const details = res.details as BackendValidationErrors | undefined
      if (details?.errors) return { fieldErrors: details.errors as any, error: res.error }
      return { error: res.error }
    }

    router.visit(`/dashboard?workspace=${res.data.workspace.id}`, { preserveScroll: true })
    return { data: res.data }
  })
