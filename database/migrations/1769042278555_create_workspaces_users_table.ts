import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'workspaces_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('workspace_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('workspaces')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('role', 20).notNullable().defaultTo('member')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.unique(['workspace_id', 'user_id'])
      table.index(['user_id'])
      table.index(['workspace_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
