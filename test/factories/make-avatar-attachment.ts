import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AvatarAttachment, AvatarAttachmentProps } from "@/domain/marketplace/enterprise/entities/avatar-attachment";

export function makeAvatarAttachment(
  overide: Partial<AvatarAttachmentProps> = {},
  id?: UniqueEntityId
) {
  const avatarAttachment = AvatarAttachment.create({
    attachmentId: new UniqueEntityId(),
    sellerId: new UniqueEntityId(),
    ...overide
  }, id)
  return avatarAttachment
}