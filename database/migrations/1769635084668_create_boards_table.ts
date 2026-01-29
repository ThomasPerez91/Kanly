import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'boards'

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
        .integer('owner_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('name', 150).notNullable()
      // Values enforced at application level via BoardTypes enum
      table.string('type', 30).notNullable()
      table.text('background_url').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['workspace_id'])
      table.index(['owner_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
