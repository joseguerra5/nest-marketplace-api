import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { View, ViewProps } from "@/domain/marketplace/enterprise/entities/view";

export function makeView(
  overide: Partial<ViewProps> = {},
  id?: UniqueEntityId
) {
  const seller = View.create({
    productId: new UniqueEntityId(),
    viewerId: new UniqueEntityId(),
    ...overide
  }, id)
  return seller
}