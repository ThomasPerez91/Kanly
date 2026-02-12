import { createSafeAction } from '~/lib/create_safe_action'
import { http } from '~/lib/http'
import { BoardListUpdateSchema } from './schema'
import type { InputType, ReturnType } from './type'

type BackendValidationErrors = {
  errors?: Record<string, string[]>
  message?: string
}

export const updateKanbanListAction = (csrfToken: string) =>
  createSafeAction<InputType, ReturnType>(BoardListUpdateSchema, async (data) => {
    const payload: Record<string, unknown> = {}

    if (data.name !== undefined) payload.name = data.name.trim()

    if (data.position !== undefined) payload.position = data.position

    if (data.visibility !== undefined) payload.visibility = data.visibility

    const res = await http.patch<ReturnType, typeof payload>(`/lists/${data.id}`, payload, {
      csrfToken,
    })

    if (!res.ok) {
      const details = res.details as BackendValidationErrors | undefined

      if (details?.errors) return { fieldErrors: details.errors as any, error: res.error }

      return { error: res.error }
    }

    return { data: res.data }
  })
