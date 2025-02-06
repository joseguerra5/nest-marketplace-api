import { ProductAttachment } from "../../enterprise/entities/product-attachment"


export abstract class ProductAttachmentsRepository {
  abstract createMany(attachments: ProductAttachment[]): Promise<void>
  abstract deleteMany(attachments: ProductAttachment[]): Promise<void>
  abstract findManyByProductdId(productId: string): Promise<ProductAttachment[]>
  abstract deleteManyByProductdId(productId: string): Promise<void>
}

