export const up = async (db) => {
  await db.schema.createTable("categories", (table) => {
    table.increments("id")
    table.text("name").notNullable()
  })
  await db.schema.alterTable("todos", (table) => {
    table.text("name").notNullable().unique()
    table.text("description").notNullable().alter()
    table.boolean("isDone").notNullable().defaultTo(false).alter()
    table.integer("categoryId").notNullable()
    table.foreign("categoryId").references("id").inTable("categories")
  })
}

export const down = async (db) => {
  await db.schema.alterTable("todos", (table) => {
    table.text("name").notNullable().unique()
    table.text("description").nullable().alter()
    table.boolean("isDone").nullable().defaultTo(null).alter()
    table.dropColumn("categoryId")
  })
  await db.schema.dropTable("categories")
}
