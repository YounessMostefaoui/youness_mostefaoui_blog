import BaseModel from "@/db/models/BaseModel"
import PostModel from "@/db/models/PostModel"

class CommentModel extends BaseModel {
  static tableName = "comments"

  static get relationMappings() {
    return {
      posts: {
        relation: BaseModel.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: "comments.id",
          to: "posts.commentId",
        },
      },
    }
  }
}

export default CommentModel
