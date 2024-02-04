import auth from "@/api/middlewares/auth"
import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  idValidator,
  pageValidator,
  statusValidator,
  postDescriptionValidator,
  postNameValidator,
} from "@/utils/validators"
import config from "@/web/config"

const handle = mw({
  POST: [
    auth, 
    validate({
      body: {
        name: postNameValidator.optional(),
        description: postDescriptionValidator,
        categoryId: idValidator,
        isDone: statusValidator.optional(),
      },
    }),
    async ({
      models: { PostModel },
      input: {
        body: { name, description, categoryId, isDone },
      },
      res,
    }) => {
      const post = await PostModel.query()
        .insertAndFetch({
          name,
          description,
          categoryId,
          isDone,
        })
        .withGraphFetched("category")

      res.send(post)
    },
  ],
 GET: [
  validate({
    query: {
      page: pageValidator.optional(),
    },
  }),
  async ({
    res,
    models: { PostModel },
    input: {
      query: { page },
    },
  }) => {
    const query = PostModel.query()
    const posts = await query
      .clone()
      .withGraphFetched("category")
      .orderBy("createdAt", "DESC")
      .limit(config.ui.itemsPerPage)
      .offset((page - 1) * config.ui.itemsPerPage)
    const [{ count }] = await query.clone().count()

    res.send({
      result: posts,
      meta: {
        count,
      },
    })
  },
],

})

export default handle
