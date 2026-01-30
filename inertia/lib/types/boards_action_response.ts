import type { BoardPublic } from '~/lib/types/board_public'

export type BoardsIndexResponse = {
  boards: BoardPublic[]
}

export type BoardCreateResponse = {
  board: BoardPublic
}

export type BoardUpdateResponse = {
  board: BoardPublic
}

export type BoardDeleteResponse = {
  ok: true
}
