import { Either, left, right } from "@/core/either"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { ProductRepository } from "../repositories/product-repository"
import { ProductStatus } from "../../enterprise/entities/product"
import { SellerRepository } from "../repositories/seller-repository"
import { Injectable } from "@nestjs/common"
import { ProductWithDetails } from "../../enterprise/entities/value-objects/product-with-details"

interface FetchProductsUseCaseRequest {
  page: number
  status?: ProductStatus
  search?: string
  sellerId: string
}

type FetchProductsUseCaseResponse = Either<ValuesNotFoundError, {
  products: ProductWithDetails[]
}>

@Injectable()
export class FetchProductsBySellerIdUseCase {
  constructor(
    private productRepository: ProductRepository,
    private sellerRepository: SellerRepository,
  ) { }

  async execute({
    page,
    search,
    status,
    sellerId
  }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const seller = await this.sellerRepository.findById(sellerId)

    if (!seller) {
      return left(new ValuesNotFoundError("Seller"))
    }

    const products = await this.productRepository.findManyWithParamsAndDetails({ page, search, status, sellerId })

    if (products.length === 0) {
      return left(new ValuesNotFoundError("Products"))
    }

    return right({
      products
    })
  }
}