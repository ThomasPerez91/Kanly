import { createSafeAction } from '~/lib/create_safe_action'
import { http } from '~/lib/http'
import { ListKanbanListsSchema } from './schema'
import type { InputType, ReturnType } from './type'

export const listKanbanListsAction = (csrfToken: string) =>
  createSafeAction<InputType, ReturnType>(ListKanbanListsSchema, async (data) => {
    const res = await http.get<ReturnType>(
      `/boards/${data.boardId}/lists`,
      { csrfToken }
    )

    if (!res.ok) return { error: res.error }

    return { data: res.data }
  })
