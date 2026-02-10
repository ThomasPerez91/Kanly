import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany} from '@adonisjs/lucid/types/relations'

import BoardList from '#models/board_list'
import User from '#models/user'
import Workspace from '#models/workspace'

import type { BoardTypes } from '#enums/board_types'

export default class Board extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare workspaceId: number

  @column()
  declare ownerId: number

  @column()
  declare name: string

  @column()
  declare type: BoardTypes

  @column()
  declare backgroundUrl: string | null

  @column()
  declare archived: boolean

  @belongsTo(() => Workspace, { foreignKey: 'workspaceId' })
  declare workspace: BelongsTo<typeof Workspace>

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => BoardList)
  declare lists: HasMany<typeof BoardList>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
