export const up = async (db) => {
  await db.schema.alterTable("posts", (table) => {
    table.timestamps(true, true, true)
  })
}

export const down = async (db) => {
  await db.schema.alterTable("posts", (table) => {
    table.dropTimestamps(true)
  })
}
