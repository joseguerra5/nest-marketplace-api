import { Either, left, right } from "@/core/either"
import { Product } from "../../enterprise/entities/product"
import { ProductRepository } from "../repositories/product-repository"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"
import { ProductAttachmentList } from "../../enterprise/entities/product-attachment-list"
import { ProductAttachment } from "../../enterprise/entities/product-attachment"
import { SellerRepository } from "../repositories/seller-repository"
import { CategoryRepository } from "../repositories/category-repository"
import { ValuesNotFoundError } from "./errors/value-not-found"

interface CreateProductUseCaseRequest {
  categoryId: string
  sellerId: string
  title: string
  description: string
  priceInCents: number
  attachmentsIds: string[]
}

type CreateProductUseCaseResponse = Either<ValuesNotFoundError, {
  product: Product
}>

export class CreateProductUseCase {
  constructor(
    private productRepository: ProductRepository,
    private sellerRepository: SellerRepository,
    private categoryRepository: CategoryRepository,
  ) { }

  async execute({
    categoryId,
    sellerId,
    title,
    description,
    priceInCents,
    attachmentsIds,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const seller = await this.sellerRepository.findById(sellerId)

    if (!seller) {
      return left(new ValuesNotFoundError("Seller"))
    }

    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      return left(new ValuesNotFoundError("Category"))
    }

    const attachmentEnpty = attachmentsIds.length === 0 || !attachmentsIds

    if (attachmentEnpty) {
      return left(new ValuesNotFoundError("Attachment"))
    }

    const product = Product.create({
      attachments: new ProductAttachmentList([]),
      categoryId: new UniqueEntityId(categoryId),
      description,
      priceInCents: Number.isInteger(priceInCents) ? priceInCents : Math.round(priceInCents * 100),
      sellerId: new UniqueEntityId(sellerId),
      title,
    })

    const ProductAttachments = attachmentsIds.map((attachmentId) => {
      return ProductAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        productId: product.id
      })
    })

    product.attachments = new ProductAttachmentList(ProductAttachments)

    await this.productRepository.create(product)

    return right({
      product
    })
  }
}