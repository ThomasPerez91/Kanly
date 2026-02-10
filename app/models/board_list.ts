import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Board from '#models/board'
import { BoardListVisibility } from '#enums/board_list_visibility'

export default class BoardList extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare boardId: number

  @column()
  declare name: string

  @column()
  declare position: string | number

  @column()
  declare visibility: BoardListVisibility

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Board)
  declare board: BelongsTo<typeof Board>
}
