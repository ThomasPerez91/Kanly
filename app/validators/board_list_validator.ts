import vine from '@vinejs/vine'
import { BoardListVisibility } from '#enums/board_list_visibility'

export const createBoardListValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150),
    // position optionnelle : si absent -> on mettra "à la fin" côté controller
    position: vine.number().optional(),
    visibility: vine.enum(Object.values(BoardListVisibility)).optional(),
  })
)

export const updateBoardListValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150).optional(),
    position: vine.number().optional(),
    visibility: vine.enum(Object.values(BoardListVisibility)).optional(),
  })
)

export const reorderBoardListsValidator = vine.compile(
  vine.object({
    orderedIds: vine.array(vine.number().positive()).minLength(1),
    reindex: vine.boolean().optional(),
  })
)

export const generateBoardListsValidator = vine.compile(
  vine.object({
    mode: vine.enum(['default', 'custom'] as const),
    lists: vine
      .array(
        vine.object({
          name: vine.string().trim().minLength(1).maxLength(150),
          visibility: vine.enum(Object.values(BoardListVisibility)).optional(),
        })
      )
      .optional(),
  })
)
