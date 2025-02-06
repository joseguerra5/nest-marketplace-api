import { AvatarAttachment } from "../../enterprise/entities/avatar-attachment";


export abstract class AvatarAttachmentsRepository {
  abstract create(attachments: AvatarAttachment): Promise<void>
  abstract delete(attachments: AvatarAttachment): Promise<void>
  abstract findBySellerId(SellerId: string): Promise<AvatarAttachment>
  abstract deleteBySellerId(AvatarId: string): Promise<void>
}

