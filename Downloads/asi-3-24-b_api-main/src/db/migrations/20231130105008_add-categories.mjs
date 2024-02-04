export const up = async (db) => {
  await db.schema.createTable("categories", (table) => {
    table.increments("id")
    table.text("name").notNullable()
  })
  await db.schema.alterTable("posts", (table) => {
    table.text("name").notNullable().unique()
    table.text("description").notNullable().alter()
    table.integer("categoryId").notNullable()
    table.foreign("categoryId").references("id").inTable("categories")
  })
  await db.schema.createTable("comments", (table) => {
    table.increments("id")
    table.text("comment")
    table.integer("PostId").notNullable()
    table.foreign("PostId").references("id").inTable("posts")
  })
}

export const down = async (db) => {
  await db.schema.alterTable("posts", (table) => {
    table.text("name").notNullable().unique()
    table.text("description").nullable().alter()
    table.dropColumn("categoryId")
  })
  await db.schema.dropTable("categories")
}
