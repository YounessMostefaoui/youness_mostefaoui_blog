import BaseModel from "@/db/models/BaseModel"
import CategoryModel from "@/db/models/CategoryModel"

class TodoModel extends BaseModel {
  static tableName = "todos"
  static get relationMappings() {
    return {
      category: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: CategoryModel,
        join: {
          from: "todos.categoryId",
          to: "categories.id",
        },
      },
    }
  }
}

export default TodoModel
