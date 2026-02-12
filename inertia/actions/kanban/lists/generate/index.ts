import { createSafeAction } from '~/lib/create_safe_action'
import { http } from '~/lib/http'
import { GenerateKanbanListsSchema } from './schema'
import type { InputType, ReturnType } from './type'

export const generateKanbanListsAction = (csrfToken: string) =>
  createSafeAction<InputType, ReturnType>(GenerateKanbanListsSchema, async (data) => {
    const payload =
      data.mode === 'default'
        ? { mode: 'default' as const }
        : {
            mode: 'custom' as const,
            lists: data.lists ?? [],
          }

    const res = await http.post<ReturnType, typeof payload>(
      `/boards/${data.boardId}/kanban/lists/generate`,
      payload,
      { csrfToken }
    )

    if (!res.ok) return { error: res.error }
    return { data: res.data }
  })
