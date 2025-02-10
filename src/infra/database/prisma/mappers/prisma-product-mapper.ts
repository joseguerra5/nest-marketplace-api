import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Product } from "@/domain/marketplace/enterprise/entities/product"
import { Product as PrismaProduct, Prisma } from "@prisma/client"

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct) {
    return Product.create(
      {
        categoryId: new UniqueEntityId(raw.categoryId),
        description: raw.description,
        title: raw.title,
        priceInCents: raw.priceInCents,
        sellerId: new UniqueEntityId(raw.sellerId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPersistence(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      categoryId: product.categoryId.toString(),
      status: product.status,
      description: product.description,
      priceInCents: product.priceInCents,
      sellerId: product.sellerId.toString(),
      title: product.title,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }
  }
}