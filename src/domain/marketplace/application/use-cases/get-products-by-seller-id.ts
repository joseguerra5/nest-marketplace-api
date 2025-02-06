import { Either, left, right } from "@/core/either"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { ProductRepository } from "../repositories/product-repository"
import { Product, ProductStatus } from "../../enterprise/entities/product"
import { SellerRepository } from "../repositories/seller-repository"

interface GetProductsUseCaseRequest {
  page: number
  status?: ProductStatus
  search?: string
  sellerId: string
}

type GetProductsUseCaseResponse = Either<ValuesNotFoundError, {
  products: Product[]
}>

export class GetProductsBySellerIdUseCase {
  constructor(
    private productRepository: ProductRepository,
    private sellerRepository: SellerRepository,
  ) { }

  async execute({
    page,
    search,
    status,
    sellerId
  }: GetProductsUseCaseRequest): Promise<GetProductsUseCaseResponse> {
    const seller = await this.sellerRepository.findById(sellerId)

    if (!seller) {
      return left(new ValuesNotFoundError("Seller"))
    }

    const products = await this.productRepository.findManyWithParams({ page, search, status, sellerId })

    if (!products) {
      return left(new ValuesNotFoundError("Products"))
    }

    return right({
      products
    })
  }
}