import { Category } from "@/domain/marketplace/enterprise/entities/category"

export class CategoriesPresenter {
  static toHttp(category: Category) {
    return {
      id: category.id,
      slug: category.slug,
      title: category.title      
  }
}
}