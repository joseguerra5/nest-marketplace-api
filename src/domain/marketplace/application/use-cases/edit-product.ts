import { Either, left, right } from "@/core/either"
import { Product } from "../../enterprise/entities/product"
import { ProductRepository } from "../repositories/product-repository"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { ProductAttachmentList } from "../../enterprise/entities/product-attachment-list"
import { ProductAttachment } from "../../enterprise/entities/product-attachment"
import { CategoryRepository } from "../repositories/category-repository"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ProductAttachmentsRepository } from "../repositories/product-attachment-repository"

interface EditProductUseCaseRequest {
  productId: string
  categoryId: string
  sellerId: string
  title: string
  description: string
  priceInCents: number
  attachmentsIds: string[]
}

type EditProductUseCaseResponse = Either<ValuesNotFoundError, {
  product: Product
}>

export class EditProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private productAttachmentRepository: ProductAttachmentsRepository,
    private categoryRepository: CategoryRepository,
  ) { }

  async execute({
    categoryId,
    sellerId,
    productId,
    title,
    description,
    priceInCents,
    attachmentsIds,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    let hasChanges = false

    const product = await this.productRepository.findById(productId)

    if (!product) {
      return left(new ValuesNotFoundError("Product"))
    }

    if (product?.status === "sold") {
      return left(new NotAllowedError())
    }

    if (!product.sellerId.equals(new UniqueEntityId(sellerId))) {
      return left(new NotAllowedError())
    }

    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      return left(new ValuesNotFoundError("Category"))
    }

    const attachmentEmpty = !attachmentsIds || attachmentsIds.length === 0

    if (attachmentEmpty) {
      return left(new ValuesNotFoundError("Attachment"))
    }

    if (product.title !== title) {
      product.title = title
      hasChanges = true
    }

    if (product.description !== description) {
      product.description = description
      hasChanges = true
    }

    if (product.categoryId !== categoryId) {
      product.categoryId = categoryId
      hasChanges = true
    }

    if (product.priceInCents !== priceInCents) {
      product.priceInCents = priceInCents
      hasChanges = true
    }
    const currentProductAttachments = await this.productAttachmentRepository.findManyByProductdId(productId)

    const productAttachmentList = new ProductAttachmentList(currentProductAttachments)

    const productAttachments = attachmentsIds.map((attachmentId) => {
      return ProductAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        productId: product.id,
      })
    })

    productAttachmentList.update(productAttachments)

    product.attachments = productAttachmentList

    if (hasChanges) {
      await this.productRepository.save(product)
    }

    return right({
      product
    })
  }
}