import { AttachmentsRepository } from "@/domain/marketplace/application/repositories/attachment-repository";
import { PrismaService } from "../prisma.service";
import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment";
import { PrismaAttachmentMapper } from "../mappers/prisma-attachment-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAttachmentRepository implements AttachmentsRepository {
  constructor(
    private prisma: PrismaService,
  ) { }
  async create(attach: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPersistence(attach)

    await this.prisma.attachment.create({
      data,
    })
  }
}