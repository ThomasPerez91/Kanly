import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Board from '#models/board'

export default class Workspace extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare ownerId: number

  @column()
  declare avatarUrl: string | null

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'workspaces_users',
    pivotForeignKey: 'workspace_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['role'],
    pivotTimestamps: true,
  })
  declare users: ManyToMany<typeof User>

  @hasMany(() => Board, { foreignKey: 'workspaceId' })
  declare boards: HasMany<typeof Board>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
