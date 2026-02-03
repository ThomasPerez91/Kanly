import type { BoardPublic } from '~/lib/types/board_public'

export type WorkspaceBoardsPageProps = {
  workspaceId: number
  archived: boolean
  boards: BoardPublic[]
}
