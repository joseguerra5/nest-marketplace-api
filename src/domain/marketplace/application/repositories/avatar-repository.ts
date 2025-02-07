import { AvatarAttachment } from "../../enterprise/entities/avatar-attachment";


export abstract class AvatarAttachmentsRepository {
  abstract create(attachments: AvatarAttachment): Promise<void>
  abstract delete(attachments: AvatarAttachment): Promise<void>
  abstract findBySellerId(sellerId: string): Promise<AvatarAttachment | null>
  abstract deleteBySellerId(avatarId: string): Promise<void>
}

