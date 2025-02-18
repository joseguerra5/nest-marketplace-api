import { AvatarAttachmentsRepository } from "@/domain/marketplace/application/repositories/avatar-repository";
import { AvatarAttachment } from "@/domain/marketplace/enterprise/entities/avatar-attachment";

export class InMemoryAvatarAttachmentRepository implements AvatarAttachmentsRepository {
  public items: AvatarAttachment[] = []

  async create(attachments: AvatarAttachment): Promise<void> {
    this.items.push(attachments)
  }
  async delete(attachments: AvatarAttachment): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === attachments.id)

    this.items.splice(itemIndex, 1)
  }
  async findBySellerId(sellerId: string): Promise<AvatarAttachment | null> {
    const avatar = this.items.find((item) => item.sellerId === sellerId)

    if (!avatar) {
      return null
    }

    return avatar
  }
  async deleteBySellerId(avatarId: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.sellerId === avatarId)

    this.items.splice(itemIndex, 1)
  }

}