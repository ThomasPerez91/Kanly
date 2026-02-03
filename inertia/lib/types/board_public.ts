export type BoardType = 'kanban' | 'table' | 'roadmap' | 'calendar'

export type BoardPublic = {
  id: number
  workspaceId: number
  ownerId: number
  name: string
  type: BoardType
  backgroundUrl: string | null
  archived: boolean
  createdAt: string
  updatedAt: string
}
