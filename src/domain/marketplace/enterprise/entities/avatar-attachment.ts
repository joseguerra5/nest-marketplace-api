import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface AvatarAttachmentProps {
  sellerId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class AvatarAttachment extends Entity<AvatarAttachmentProps> {
  get SellerId() {
    return this.props.SellerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AvatarAttachmentProps, id?: UniqueEntityId) {
    const attachment = new AvatarAttachment(props, id)

    return attachment
  }
}