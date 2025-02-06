import { Either, left, right } from "@/core/either"
import { ProductRepository } from "../repositories/product-repository"
import { SellerRepository } from "../repositories/seller-repository"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { ViewerIsOwnerProduct } from "./errors/viewer-ownew-product"
import { ViewRepository } from "../repositories/view-repository"
import { View } from "../../enterprise/entities/view"

interface RegisterViewerUseCaseRequest {
  productId: string
  viewerId: string
}

type RegisterViewerUseCaseResponse = Either<ViewerIsOwnerProduct, {
  view: View
}>

export class RegisterViewerUseCase {
  constructor(
    private viewerRepository: ViewRepository,
    private productRepository: ProductRepository,
    private sellerRepository: SellerRepository,
  ) { }

  async execute({
    productId,
    viewerId
  }: RegisterViewerUseCaseRequest): Promise<RegisterViewerUseCaseResponse> {
    const seller = await this.sellerRepository.findById(viewerId)

    if (!seller) {
      return left(new ValuesNotFoundError("Seller"))
    }

    const product = await this.productRepository.findById(productId)

    if (!product) {
      return left(new ValuesNotFoundError("Product"))
    }

    if (product.sellerId.toString() === viewerId) {
      return left(new ViewerIsOwnerProduct())
    }

    const viewAlreadyRegister = await this.viewerRepository.findByViewerId(viewerId, productId)

    if (viewAlreadyRegister) {
      return left(new ViewerIsOwnerProduct())
    }

    const view = View.create({
      productId,
      viewerId,
    })

    await this.viewerRepository.create(view)

    return right({
      view
    })
  }
}