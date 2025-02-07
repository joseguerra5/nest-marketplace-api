import { AvatarAttachmentsRepository } from "@/domain/marketplace/application/repositories/avatar-repository";
import { PrismaService } from "../prisma.service";
import { AvatarAttachment } from "@/domain/marketplace/enterprise/entities/avatar-attachment";
import { PrismaAvatarMapper } from "../mappers/prisma-avatar-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAvatarRepository implements AvatarAttachmentsRepository {
  constructor(
    private prisma: PrismaService,
  ) { }
  async create(attachments: AvatarAttachment): Promise<void> {
    const data = PrismaAvatarMapper.toPrismaUpdate(attachments)

    await this.prisma.attachment.update(data)
  }
  async delete(attachments: AvatarAttachment): Promise<void> {
    await this.prisma.attachment.delete({
      where: {
        id: attachments.id.toString()
      }
    })
  }

  async findBySellerId(sellerId: string): Promise<AvatarAttachment | null> {
    const avatar = await this.prisma.attachment.findUnique({
      where: {
        userId: sellerId
      }
    })

    if (!avatar) {
      return null
    }


    return PrismaAvatarMapper.toDomain(avatar)
  }

  async deleteBySellerId(avatarId: string): Promise<void> {
    await this.prisma.attachment.delete({
      where: {
        id: avatarId
      }
    })
  }
}