import { createSafeAction } from '~/lib/create_safe_action'
import { http } from '~/lib/http'
import { ListBoardSchema } from './schema'
import type { InputType, ReturnType } from './type'

export const listBoardsAction = (csrfToken: string) =>
  createSafeAction<InputType, ReturnType>(ListBoardSchema, async (data) => {
    const res = await http.get<ReturnType>(`/workspaces/${data.workspaceId}/boards`, { csrfToken })

    if (!res.ok) return { error: res.error }
    return { data: res.data }
  })
