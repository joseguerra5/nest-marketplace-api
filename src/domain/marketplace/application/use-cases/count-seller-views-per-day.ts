import { Either, left, right } from "@/core/either"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { SellerRepository } from "../repositories/seller-repository"
import { NotAllowedError } from "@/core/errors/not-allowed-error"
import { ViewRepository, ViewsPerDay } from "../repositories/view-repository"
import { Injectable } from "@nestjs/common"

interface CountSellerViewsPerDayUseCaseRequest {
  sellerId: string
}

type CountSellerViewsPerDayUseCaseResponse = Either<ValuesNotFoundError | NotAllowedError, {
  viewsPerDay: ViewsPerDay[]
}>

@Injectable()
export class CountSellerViewsPerDayUseCase {
  constructor(
    private sellerRepository: SellerRepository,
    private viewRepository: ViewRepository,
  ) { }

  async execute({
    sellerId,
  }: CountSellerViewsPerDayUseCaseRequest): Promise<CountSellerViewsPerDayUseCaseResponse> {
    const seller = await this.sellerRepository.findById(sellerId)

    if (!seller) {
      return left(new NotAllowedError())
    }

    const toDay = new Date()
    const last30Days = new Date().setDate(toDay.getDate() - 30)

    const viewsPerDay = await this.viewRepository.countPerDay({ sellerId, from: new Date(last30Days) })

    return right({
      viewsPerDay
    })
  }
}