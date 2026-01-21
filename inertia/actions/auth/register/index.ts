import { router } from '@inertiajs/react'
import { createSafeAction } from '~/lib/create_safe_action'
import { http } from '~/lib/http'
import { RegisterSchema } from './schema'
import type { InputType, ReturnType } from './type'

type BackendValidationErrors = {
  errors?: Record<string, string[]>
  message?: string
}

export const registerAction = (csrfToken: string) =>
  createSafeAction<InputType, ReturnType>(RegisterSchema, async (data) => {
    const res = await http.post<ReturnType, InputType>('/auth/register', data, {
      csrfToken,
    })

    if (!res.ok) {
      const details = res.details as BackendValidationErrors | undefined

      if (details?.errors) {
        return { fieldErrors: details.errors as any, error: res.error }
      }

      return { error: res.error }
    }

    router.visit('/dashboard')
    return { data: res.data }
  })
