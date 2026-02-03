import type { BoardTypes } from '#enums/board_types'

export type BoardPublicDTO = {
  id: number
  workspaceId: number
  ownerId: number
  name: string
  type: BoardTypes
  backgroundUrl: string | null
  archived: boolean
  createdAt: string
  updatedAt: string
}
