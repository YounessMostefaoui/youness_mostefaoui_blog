import { faker } from "@faker-js/faker"

export const seed = async (db) => {
  await db("todos").delete()
  await db("categories").delete()
  await db("users").delete()
  await db("users").insert([
  ...[...Array(5)].map(() => ({
    email: faker.internet.email(),
    passwordHash: "alskdjalsdkjasdlkj",
    passwordSalt: "alskdjalsdkjasdlkj",
    role: "user",
    activate: true
  }))
])

  const categories = await db("categories")
    .insert(
      [...new Array(30)].map(() => ({
        name: faker.word.noun(),
      })),
    )
    .returning("*")
  await db("todos").insert(
    [...new Array(3000)].map(() => ({
      name: faker.word.words({ count: { min: 2, max: 10 } }),
      description: faker.word.words({ count: { min: 2, max: 100 } }),
      isDone: faker.number.int({ min: 1, max: 30 }) % 7 === 0,
      categoryId:
        categories[faker.number.int({ min: 0, max: categories.length - 1 })].id,
    })),
  )
}
