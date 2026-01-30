import { router } from '@inertiajs/react'
import { createSafeAction } from '~/lib/create_safe_action'
import { http } from '~/lib/http'
import { BoardCreateSchema } from './schema'
import type { InputType, ReturnType } from './type'

type BackendValidationErrors = {
  errors?: Record<string, string[]>
  message?: string
}

export const createBoardAction = (csrfToken: string) =>
  createSafeAction<InputType, ReturnType>(BoardCreateSchema, async (data) => {
    const payload = {
      name: data.name.trim(),
      type: data.type,
      backgroundUrl: (data.backgroundUrl ?? null) ? String(data.backgroundUrl).trim() : null,
    }

    const res = await http.post<ReturnType, typeof payload>(
      `/workspaces/${data.workspaceId}/boards`,
      payload,
      { csrfToken }
    )

    if (!res.ok) {
      const details = res.details as BackendValidationErrors | undefined
      if (details?.errors) return { fieldErrors: details.errors as any, error: res.error }
      return { error: res.error }
    }

    router.reload({ preserveScroll: true })
    return { data: res.data }
  })
