import mw from "@/api/mw"

const handle = mw({
  GET: [
    async ({
      models: { CategoryModel },
      req: {
        query: { categoryId },
      },
      res,
    }) => {
      const category = await CategoryModel.query()
        .findById(categoryId)
        .throwIfNotFound()

      res.send(category)
    },
  ],
  PATCH: [
    async ({
      models: { CategoryModel },
      req: {
        body,
        query: { categoryId },
      },
      res,
    }) => {
      const updatedCategory = await CategoryModel.query()
        .updateAndFetchById(categoryId, {
          ...body,
          updatedAt: CategoryModel.fn.now(),
        })
        .throwIfNotFound()

      res.send(updatedCategory)
    },
  ],
  DELETE: [
    async ({
      models: { TodoModel, CategoryModel },
      req: {
        query: { categoryId },
      },
      res,
    }) => {
      const category = await CategoryModel.query()
        .findById(categoryId)
        .throwIfNotFound()

      await TodoModel.query().delete().where({ categoryId })
      await category.$query().delete()

      res.send(category)
    },
  ],
})

export default handle
