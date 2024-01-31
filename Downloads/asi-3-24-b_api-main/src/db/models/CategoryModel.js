import BaseModel from "@/db/models/BaseModel"
import TodoModel from "@/db/models/TodoModel"

class CategoryModel extends BaseModel {
  static tableName = "categories"

  static get relationMappings() {
    return {
      todos: {
        relation: BaseModel.HasManyRelation,
        modelClass: TodoModel,
        join: {
          from: "categories.id",
          to: "todos.categoryId",
        },
      },
    }
  }
}

export default CategoryModel
