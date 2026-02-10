import BoardList from '#models/board_list'
import type Board from '#models/board'
import { BoardListVisibility } from '#enums/board_list_visibility'

type CreateOneInput = {
  board: Board
  name: string
  position?: number
  visibility?: BoardListVisibility
}

type CreateManyInput = {
  board: Board
  lists: Array<{
    name: string
    position?: number
    visibility?: BoardListVisibility
  }>
}

const toNumber = (v: unknown): number => {
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    const n = Number.parseFloat(v)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

const resolvePositionAtEnd = async (boardId: number): Promise<number> => {
  const last = await BoardList.query().where('board_id', boardId).orderBy('position', 'desc').first()
  const lastPos = last ? toNumber(last.position) : 0
  return (Number.isFinite(lastPos) ? lastPos : 0) + 100
}

export class ListCreator {
  async createOne(input: CreateOneInput): Promise<BoardList> {
    const position = input.position ?? (await resolvePositionAtEnd(input.board.id))

    return await BoardList.create({
      boardId: input.board.id,
      name: input.name,
      position,
      visibility: input.visibility ?? BoardListVisibility.Showed,
    })
  }

  async createMany(input: CreateManyInput): Promise<BoardList[]> {
    let nextPos = await resolvePositionAtEnd(input.board.id)

    const payload = input.lists.map((l) => {
      const position = l.position ?? nextPos
      if (l.position === undefined) nextPos += 100

      return {
        boardId: input.board.id,
        name: l.name,
        position,
        visibility: l.visibility ?? BoardListVisibility.Showed,
      }
    })

    return await BoardList.createMany(payload)
  }
}
