import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'social_accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.string('provider', 32).notNullable()
      table.string('provider_user_id', 255).notNullable()
      table.text('access_token').nullable()
      table.text('refresh_token').nullable()
      table.timestamp('token_expires_at', { useTz: true }).nullable()
      table.jsonb('raw').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.unique(['provider', 'provider_user_id'])
      table.index(['user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
