import { router } from '@inertiajs/react'
import { createSafeAction } from '~/lib/create_safe_action'
import { http } from '~/lib/http'
import { BoardDeleteSchema } from './schema'
import type { InputType, ReturnType } from './type'

export const deleteBoardAction = (csrfToken: string) =>
  createSafeAction<InputType, ReturnType>(BoardDeleteSchema, async (data) => {
    const res = await http.delete<void>(`/boards/${data.id}`, { csrfToken })

    if (!res.ok) return { error: res.error }

    router.reload({ preserveScroll: true })
    return { data: undefined }
  })
