import { Either, left, right } from "@/core/either"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { ProductRepository } from "../repositories/product-repository"
import { Product, ProductStatus } from "../../enterprise/entities/product"
import { SellerRepository } from "../repositories/seller-repository"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ProductWithSameStatus } from "./errors/same-status"

interface ChangeProductStatusUseCaseRequest {
  status: ProductStatus
  productId: string
  sellerId: string
}

type ChangeProductStatusUseCaseResponse = Either<NotAllowedError | ProductWithSameStatus, {
  product: Product
}>

export class ChangeProductStatusBySellerIdUseCase {
  constructor(
    private productRepository: ProductRepository,
    private sellerRepository: SellerRepository,
  ) { }

  async execute({
    status,
    sellerId,
    productId,
  }: ChangeProductStatusUseCaseRequest): Promise<ChangeProductStatusUseCaseResponse> {
    const seller = await this.sellerRepository.findById(sellerId)

    if (!seller) {
      return left(new NotAllowedError())
    }

    const product = await this.productRepository.findById(productId)

    if (!product) {
      return left(new ValuesNotFoundError("Product"))
    }

    if (product.sellerId !== seller.id) {
      return left(new NotAllowedError())
    }

    if (status === "cancelled" && product.status === "sold") {
      return left(new ProductWithSameStatus())
    }

    if (status === "sold" && product.status === "cancelled") {
      return left(new ProductWithSameStatus())
    }

    product.status = status

    await this.productRepository.save(product)

    return right({
      product
    })
  }
}