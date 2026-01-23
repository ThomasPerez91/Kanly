import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

import SocialAccount from '#models/social_account'
import Workspace from '#models/workspace'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  declare timezone: string | null

  @column()
  declare avatarUrl: string | null

  @hasMany(() => SocialAccount)
  declare socialAccounts: HasMany<typeof SocialAccount>

  @manyToMany(() => Workspace, {
    pivotTable: 'workspaces_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'workspace_id',
    pivotColumns: ['role'],
    pivotTimestamps: true,
  })
  declare workspaces: ManyToMany<typeof Workspace>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
