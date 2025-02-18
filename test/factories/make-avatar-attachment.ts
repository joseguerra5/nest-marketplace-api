import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { AvatarAttachment, AvatarAttachmentProps } from "@/domain/marketplace/enterprise/entities/avatar-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

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

@Injectable()
export class AvatarAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAvatarAttachment(
    data: Partial<AvatarAttachmentProps> = {},
  ): Promise<AvatarAttachment> {
    const avatar = makeAvatarAttachment(data)

    await this.prisma.attachment.update({
      where: {
        id: avatar.attachmentId.toString()
      },
      data: {
        userId: avatar.sellerId.toString()
      },
    })

    return avatar
  }
}