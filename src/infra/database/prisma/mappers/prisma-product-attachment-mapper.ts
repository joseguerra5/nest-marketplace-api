import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { ProductAttachment } from "@/domain/marketplace/enterprise/entities/product-attachment"
import { Attachment as PrismaAttachment, Prisma } from "@prisma/client"

export class PrismaProductAttachmentMapper {
  static toDomain(raw: PrismaAttachment): ProductAttachment {
    if (!raw.productId) {
      throw new Error("Invalid attachment type")
    }

    return ProductAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        productId: new UniqueEntityId(raw.productId),
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrismaUpdateMany(attachments: ProductAttachment[]): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map(attachment => {
      return attachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentsIds
        },
      },
      data: {
        productId: attachments[0].productId.toString()
      }
    }
  }
}