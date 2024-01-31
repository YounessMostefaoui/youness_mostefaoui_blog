export const up = async (db) => {
  await db.schema.alterTable("todos", (table) => {
    table.timestamps(true, true, true)
  })
}

export const down = async (db) => {
  await db.schema.alterTable("todos", (table) => {
    table.dropTimestamps(true)
  })
}
