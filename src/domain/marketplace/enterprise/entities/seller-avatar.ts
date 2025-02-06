import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export interface SellerAvatarProps {
  sellerId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class SellerAvatar extends Entity<SellerAvatarProps> {
  get sellerId() {
    return this.props.sellerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: SellerAvatarProps, id?: UniqueEntityId) {
    const attachment = new SellerAvatar(props,id)

    return attachment
  }
}