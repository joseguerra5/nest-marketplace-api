import { faker } from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Category, CategoryProps } from "@/domain/marketplace/enterprise/entities/category";

export function makeCategory(
  overide: Partial<CategoryProps> = {},
  id?: UniqueEntityId
) {
  const category = Category.create({
    slug: faker.lorem.slug(),
    title: faker.lorem.words(),
    ...overide
  }, id)
  return category
}