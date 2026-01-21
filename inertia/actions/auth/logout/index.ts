import { http } from '~/lib/http'
import type { ReturnType } from './type'

export const logoutAction = (csrfToken: string) => {
  return http.post<ReturnType, Record<string, never>>('/auth/logout', {}, { csrfToken })
}
