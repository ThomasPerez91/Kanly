import { router } from '@inertiajs/react'
import { createSafeAction } from '~/lib/create_safe_action'
import { http } from '~/lib/http'
import { WorkspaceUpdateSchema } from './schema'
import type { InputType, ReturnType } from './type'

type BackendValidationErrors = {
  errors?: Record<string, string[]>
  message?: string
}

export const updateWorkspaceAction = (csrfToken: string) =>
  createSafeAction<InputType, ReturnType>(WorkspaceUpdateSchema, async (data) => {
    const payload = {
      name: data.name.trim(),
      avatarUrl: (data.avatarUrl ?? null) ? String(data.avatarUrl).trim() : null,
    }

    const res = await http.patch<ReturnType, typeof payload>(`/workspaces/${data.id}`, payload, {
      csrfToken,
    })

    if (!res.ok) {
      const details = res.details as BackendValidationErrors | undefined
      if (details?.errors) return { fieldErrors: details.errors as any, error: res.error }
      return { error: res.error }
    }

    router.reload({ preserveScroll: true })
    return { data: res.data }
  })
