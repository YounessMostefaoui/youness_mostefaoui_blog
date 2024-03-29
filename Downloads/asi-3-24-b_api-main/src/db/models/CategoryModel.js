import BaseModel from "@/db/models/BaseModel"
import PostModel from "@/db/models/PostModel"

class CategoryModel extends BaseModel {
  static tableName = "categories"

  static get relationMappings() {
    return {
      posts: {
        relation: BaseModel.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: "categories.id",
          to: "posts.categoryId",
        },
      },
    }
  }
}

export default CategoryModel
