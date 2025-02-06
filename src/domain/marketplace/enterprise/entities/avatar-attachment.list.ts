import { WatchedList } from "@/core/entities/watched-list";
import { AvatarAttachment } from "./avatar-attachment";


export class AvatarAttachmentList extends WatchedList<AvatarAttachment> {
  compareItems(a: AvatarAttachment, b: AvatarAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}