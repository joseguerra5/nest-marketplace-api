import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment"
import { Prisma } from "@prisma/client"

export class PrismaAttachmentMapper {
  static toPersistence(attachment: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.title,
    }
  }
}