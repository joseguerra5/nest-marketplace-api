import { AttachmentsRepository } from "@/domain/marketplace/application/repositories/attachment-repository";
import { Attachment } from "@/domain/marketplace/enterprise/entities/attachment";

export class InMemoryAttachmentRepository implements AttachmentsRepository {
  public items: Attachment[] = [];

  async create(attach: Attachment): Promise<void> {
    this.items.push(attach)
  }
}