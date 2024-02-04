import { validate } from "@/api/middlewares/validate"
import mw from "@/api/mw"
import { commentValidator, pageValidator, idValidator } from "@/utils/validators"
import config from "@/web/config"

const handle = mw({
  POST: [
    validate({
      body: {
        comment: commentValidator,
        postId: idValidator, 
      },
    }),
    async ({
      models: { CommentModel },
      input: {
        body: { comment, postId },
      },
      res,
    }) => {
      const newComment = await CommentModel.query().insertAndFetch({ comment, postId })

      res.send(newComment)
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
      models: { CommentModel },
      input: {
        query: { page },
      },
    }) => {
      const query = CommentModel.query()
      const comments = await query
        .clone()
        .limit(config.ui.itemsPerPage)
        .offset((page - 1) * config.ui.itemsPerPage)
      const [{ count }] = await query.clone().count()

      res.send({
        result: comments,
        meta: {
          count,
        },
      })
    },
  ],
})

export default handle

