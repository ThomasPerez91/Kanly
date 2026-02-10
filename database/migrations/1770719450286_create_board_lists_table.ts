import { BaseSchema } from '@adonisjs/lucid/schema'
import { BoardListVisibility } from '#enums/board_list_visibility'

export default class CreateBoardListsTable extends BaseSchema {
  protected tableName = 'board_lists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('board_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('boards')
        .onDelete('CASCADE')
      table.string('name', 150).notNullable()
      table.decimal('position', 20, 10).notNullable().defaultTo(100)
      table
        .enu('visibility', Object.values(BoardListVisibility))
        .notNullable()
        .defaultTo(BoardListVisibility.Showed)

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.index(['board_id'])
      table.index(['board_id', 'position'])
      table.index(['board_id', 'visibility'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
