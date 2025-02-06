import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface CategoryProps {
  title: string
  slug: string
}

export class Category extends Entity<CategoryProps> {
  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  static create(props: CategoryProps, id?: UniqueEntityId) {
    const category = new Category(props, id)

    return category
  }
}