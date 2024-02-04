import BaseModel from "@/db/models/BaseModel"
import CategoryModel from "@/db/models/CategoryModel"

class PostModel extends BaseModel {
  static tableName = "posts"
  static get relationMappings() {
    return {
      category: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: CategoryModel,
        join: {
          from: "posts.categoryId",
          to: "categories.id",
        },
      },
    }
  }
}

export default PostModel
