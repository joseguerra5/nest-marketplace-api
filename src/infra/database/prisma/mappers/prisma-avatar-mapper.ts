import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { AvatarAttachment } from "@/domain/marketplace/enterprise/entities/avatar-attachment"
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client"

export class PrismaAvatarMapper {
  static toDomain(raw: PrismaAttachment): AvatarAttachment {

    if (!raw.userId) {
      throw new Error("User not exist")
    }

    return AvatarAttachment.create({
      attachmentId: new UniqueEntityId(raw.id),
      sellerId: new UniqueEntityId(raw.userId),
    }, new UniqueEntityId(raw.id))
  }
  static toPrismaUpdate(avatar: AvatarAttachment): Prisma.AttachmentUpdateArgs {
    return {
      where: {
        id: avatar.attachmentId.toString()
      },
      data: {
        userId: avatar.sellerId.toString()
      }
    }
  }
}