import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Category } from "@/domain/marketplace/enterprise/entities/category"
import { Category as PrismaCategory, Prisma } from "@prisma/client"

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory) {
    return Category.create(
      {
        slug: raw.slug,
        title: raw.title
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPersistence(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      slug: category.slug,
      title: category.title,
    }
  }
}