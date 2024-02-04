import auth from "@/api/middlewares/auth"
import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import {
  idValidator,
  statusValidator,
  postDescriptionValidator,
} from "@/utils/validators"

const handle = mw({
  GET: [
    validate({
      query: {
        postId: idValidator,
      },
    }),
    async ({
  models: { PostModel },
  input: {
    query: { postId },
  },
  res,
}) => {
  if (!postId) {
    res.status(400).send({ error: "postId is required in the query" })
    
    return
  }

  const post = await PostModel.query().findById(postId).throwIfNotFound()

  res.send(post)
},
  ],
  PATCH: [
    auth,
    validate({
      query: {
        postId: idValidator,
      },
      body: {
        description: postDescriptionValidator.optional(),
        categoryId: idValidator.optional(),
        isDone: statusValidator.optional(),
      },
    }),
    async ({
      models: { PostModel },
      input: {
        body,
        query: { postId },
      },
      res,
    }) => {
      const updatedPost = await PostModel.query()
        .updateAndFetchById(postId, {
          ...body,
          updatedAt: PostModel.fn.now(),
        })
        .withGraphFetched("category")
        .throwIfNotFound()

      res.send(updatedPost)
    },
  ],
  DELETE: [
    auth,
    validate({
      query: {
        postId: idValidator,
      },
    }),
    async ({
      models: { PostModel },
      input: {
        query: { postId },
      },
      res,
    }) => {
      const post = await PostModel.query().findById(postId).throwIfNotFound()

      await post.$query().delete()

      res.send(post)
    },
  ],
})

export default handle
