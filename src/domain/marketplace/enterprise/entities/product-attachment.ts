import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface ProductAttachmentProps {
  productId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class ProductAttachment extends Entity<ProductAttachmentProps> {
  get productId() {
    return this.props.productId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: ProductAttachmentProps, id?: UniqueEntityId) {
    const attachment = new ProductAttachment(props, id)

    return attachment
  }
}