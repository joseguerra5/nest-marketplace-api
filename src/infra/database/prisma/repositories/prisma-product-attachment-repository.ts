import { ProductAttachmentsRepository } from "@/domain/marketplace/application/repositories/product-attachment-repository";
import { PrismaService } from "../prisma.service";
import { ProductAttachment } from "@/domain/marketplace/enterprise/entities/product-attachment";
import { PrismaProductAttachmentMapper } from "../mappers/prisma-product-attachment-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaProductAttachmentRepository implements ProductAttachmentsRepository {
  constructor(
    private prisma: PrismaService,
  ) { }
  async deleteManyByProductdId(productId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        productId
      }
    })
  }

  async createMany(attachments: ProductAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaProductAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: ProductAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentIds = attachments.map(attachment => {
      return attachment.id.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds
        }
      }
    })
  }
  async findManyByProductdId(productId: string): Promise<ProductAttachment[]> {
    const productAttachments = await this.prisma.attachment.findMany({
      where: {
        productId
      }
    })

    return productAttachments.map(PrismaProductAttachmentMapper.toDomain)
  }
}