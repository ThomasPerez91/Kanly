import { router } from '@inertiajs/react'
import { createSafeAction } from '~/lib/create_safe_action'
import { http } from '~/lib/http'
import { BoardUpdateSchema } from './schema'
import type { InputType, ReturnType } from './type'

type BackendValidationErrors = {
  errors?: Record<string, string[]>
  message?: string
}

export const updateBoardAction = (csrfToken: string) =>
  createSafeAction<InputType, ReturnType>(BoardUpdateSchema, async (data) => {
    const payload: Record<string, unknown> = {}

    if (data.name !== undefined) payload.name = data.name.trim()
    if (data.type !== undefined) payload.type = data.type
    if (data.backgroundUrl !== undefined) {
      payload.backgroundUrl =
        (data.backgroundUrl ?? null) ? String(data.backgroundUrl).trim() : null
    }

    const res = await http.patch<ReturnType, typeof payload>(`/boards/${data.id}`, payload, {
      csrfToken,
    })

    if (!res.ok) {
      const details = res.details as BackendValidationErrors | undefined
      if (details?.errors) return { fieldErrors: details.errors as any, error: res.error }
      return { error: res.error }
    }

    router.reload({ preserveUrl: true })
    return { data: res.data }
  })
