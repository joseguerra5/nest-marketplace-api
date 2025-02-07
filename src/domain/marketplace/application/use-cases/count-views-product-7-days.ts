import { Either, left, right } from "@/core/either"
import { ProductRepository } from "../repositories/product-repository"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ViewRepository } from "../repositories/view-repository"
import { Injectable } from "@nestjs/common"

interface CountViewsProduct7daysUseCaseRequest {
  productId: string
}

type CountViewsProduct7daysUseCaseResponse = Either<ValuesNotFoundError | NotAllowedError, {
  amount: number
}>

@Injectable()
export class CountViewsProduct7daysUseCase {
  constructor(
    private productRepository: ProductRepository,
    private viewRepository: ViewRepository,
  ) { }

  async execute({
    productId,
  }: CountViewsProduct7daysUseCaseRequest): Promise<CountViewsProduct7daysUseCaseResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      return left(new NotAllowedError())
    }

    const toDay = new Date()
    const last30Days = new Date().setDate(toDay.getDate() - 7)

    const amount = await this.viewRepository.countByProduct({ productId, from: new Date(last30Days) })


    return right({
      amount
    })
  }
}