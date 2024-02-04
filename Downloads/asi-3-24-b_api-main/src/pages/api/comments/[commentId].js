import mw from "@/api/mw"

const handle = mw({
  GET: [
    async ({
      models: { CommentModel },
      req: {
        query: { commentId },
      },
      res,
    }) => {
      const comment = await CommentModel.query()
        .findById(commentId)
        .throwIfNotFound()

      res.send(comment)
    },
  ],
  PATCH: [
    async ({
      models: { CommentModel },
      req: {
        body,
        query: { commentId },
      },
      res,
    }) => {
      const updatedComment = await CommentModel.query()
        .updateAndFetchById(commentId, {
          ...body,
          updatedAt: CommentModel.fn.now(),
        })
        .throwIfNotFound()

      res.send(updatedComment)
    },
  ],
  DELETE: [
    async ({
      models: {  CommentModel },
      req: {
        query: { commentId },
      },
      res,
    }) => {
      const comment = await CommentModel.query()
        .findById(commentId)
        .throwIfNotFound()

      await comment.$query().delete()

      res.send(comment)
    },
  ],
})

export default handle
