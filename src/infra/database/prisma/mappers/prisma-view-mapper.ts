import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { View } from "@/domain/marketplace/enterprise/entities/view"
import { View as PrismaView, Prisma } from "@prisma/client"

export class PrismaViewMapper {
  static toDomain(raw: PrismaView) {
    return View.create(
      {
        productId: new UniqueEntityId(raw.productId),
        viewerId: new UniqueEntityId(raw.viewerId),
        createdAt: raw.createdAt
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPersistence(view: View): Prisma.ViewUncheckedCreateInput {
    return {
      id: view.id.toString(),
      productId: view.productId.toString(),
      viewerId: view.viewerId.toString(),
      createdAt: view.createdAt
    }
  }
}