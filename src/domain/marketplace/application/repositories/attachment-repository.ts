import { Attachment } from "../../enterprise/entities/attachment";

export abstract class AttachmentsRepository {
  abstract create(attach: Attachment): Promise<void>
}