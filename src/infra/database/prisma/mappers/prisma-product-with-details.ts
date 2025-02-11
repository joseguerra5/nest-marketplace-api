import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Category } from "@/domain/marketplace/enterprise/entities/category"
import { ProductStatus } from "@/domain/marketplace/enterprise/entities/product"
import { Seller } from "@/domain/marketplace/enterprise/entities/seller"
import { ProductWithDetails } from "@/domain/marketplace/enterprise/entities/value-objects/product-with-details"
import { Product as PrismaProduct, User as PrismaSeller, Category as PrismaCategory, Attachment as PrismaAttachment } from "@prisma/client"

type PrismaProductWithDetails = PrismaProduct & {
  seller: PrismaSeller
  category: PrismaCategory
  attachments: PrismaAttachment[]
}


export class PrismaProductWithDetailsMapper {
  static toDomain(raw: PrismaProductWithDetails): ProductWithDetails {
    return ProductWithDetails.create({
      productId: new UniqueEntityId(raw.id),
      priceInCents: raw.priceInCents,
      description: raw.description,
      status: raw.status as ProductStatus,
      title: raw.title,
      owner: Seller.create({
        email: raw.seller.email,
        name: raw.seller.name,
        phone: raw.seller.phone,
        password: raw.seller.password,
      }),
      category: Category.create({
        slug: raw.category.slug,
        title: raw.category.title,
      })
    })
  }
}