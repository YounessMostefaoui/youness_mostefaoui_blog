import { faker } from "@faker-js/faker"

export const seed = async (db) => {
  await db("comments").delete()
  await db("posts").delete()
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
  const posts = await db("posts").insert(
    [...new Array(10)].map(() => ({
      name: faker.word.words({ count: { min: 2, max: 5} }),
      description: faker.word.words({ count: { min: 2, max: 100 } }),
      categoryId: categories[faker.number.int({ min: 0, max: categories.length - 1 })].id,
    })),
  ).returning("*")

  await db("comments")
    .insert(
      [...new Array(20)].map(() => ({
        comment: faker.word.words({ count: { min: 2, max: 50 } }),
        PostId: posts[faker.number.int({ min: 0, max: posts.length - 1 })].id,
      })),
    )
    .returning("*")
}

