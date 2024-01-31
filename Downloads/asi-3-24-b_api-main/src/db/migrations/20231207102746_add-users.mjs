export const up = async (db) => {
  await db.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("email").notNullable().unique()
    table.text("firstname")
    table.text("lastname")
    table.text("datebirth")
    table.boolean("activate")
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.text("role").notNullable()
    table.timestamps(true, true, true)
  })
}


export const down = async (db) => {
  await db.schema.dropTable("users")
}
