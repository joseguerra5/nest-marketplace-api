import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ProductAttachment, ProductAttachmentProps } from "@/domain/marketplace/enterprise/entities/product-attachment";

export function makeProductAttachment(
  overide: Partial<ProductAttachmentProps> = {},
  id?: UniqueEntityId
) {
  const productAttachment = ProductAttachment.create({
    attachmentId: new UniqueEntityId(),
    productId: new UniqueEntityId(),
    ...overide
  }, id)
  return productAttachment
}