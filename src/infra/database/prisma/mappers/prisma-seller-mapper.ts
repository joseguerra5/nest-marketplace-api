import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { Seller } from "@/domain/marketplace/enterprise/entities/seller"
import { User as PrismaSeller, Prisma } from "@prisma/client"

export class PrismaSellerMapper {
  static toDomain(raw: PrismaSeller) {
    return Seller.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
        phone: raw.phone,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPersistence(seller: Seller): Prisma.UserUncheckedCreateInput {
    return {
      id: seller.id.toString(),
      email: seller.email,
      name: seller.name,
      password: seller.password,
      phone: seller.phone,
    }
  }
}