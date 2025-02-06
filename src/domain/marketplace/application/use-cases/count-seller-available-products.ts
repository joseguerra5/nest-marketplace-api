import { Either, left, right } from "@/core/either"
import { ProductRepository } from "../repositories/product-repository"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { SellerRepository } from "../repositories/seller-repository"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ProductStatus } from "../../enterprise/entities/product"

interface CountSellerAvailableProductsUseCaseRequest {
  sellerId: string
}

type CountSellerAvailableProductsUseCaseResponse = Either<ValuesNotFoundError | NotAllowedError, {
  amount: number
}>

export class CountSellerAvailableProductsUseCase {
  constructor(
    private productRepository: ProductRepository,
    private sellerRepository: SellerRepository,
  ) { }

  async execute({
    sellerId,
  }: CountSellerAvailableProductsUseCaseRequest): Promise<CountSellerAvailableProductsUseCaseResponse> {
    const seller = await this.sellerRepository.findById(sellerId)

    if (!seller) {
      return left(new NotAllowedError())
    }

    const toDay = new Date()
    const last30Days = new Date().setDate(toDay.getDate() - 30)

    const amount = await this.productRepository.count({ sellerId, from: new Date(last30Days), status: ProductStatus.available })


    return right({
      amount
    })
  }
}