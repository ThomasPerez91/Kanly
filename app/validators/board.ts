import vine from '@vinejs/vine'
import { BoardTypes } from '#enums/board_types'

export const createBoardValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150),

    // enum runtime values: ['kanban', 'table', ...]
    type: vine.enum(Object.values(BoardTypes)),

    // nullable => autorise explicitement null
    // optional => peut être absent
    backgroundUrl: vine.string().trim().url().nullable().optional(),
  })
)

export const updateBoardValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150).optional(),
    type: vine.enum(Object.values(BoardTypes)).optional(),
    backgroundUrl: vine.string().trim().url().nullable().optional(),
  })
)
