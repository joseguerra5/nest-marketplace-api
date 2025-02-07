import { Either, left, right } from "@/core/either"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { Seller } from "../../enterprise/entities/seller"
import { SellerRepository } from "../repositories/seller-repository"
import { Injectable } from "@nestjs/common"

interface GetSellerProfileUseCaseRequest {
  sellerId: string
}

type GetSellerProfileUseCaseResponse = Either<ValuesNotFoundError, {
  seller: Seller
}>

@Injectable()
export class GetSellerProfileUseCase {
  constructor(
    private sellerRepository: SellerRepository,
  ) { }

  async execute({
    sellerId
  }: GetSellerProfileUseCaseRequest): Promise<GetSellerProfileUseCaseResponse> {
    const seller = await this.sellerRepository.findById(sellerId)

    if (!seller) {
      return left(new ValuesNotFoundError("seller"))
    }

    return right({
      seller
    })
  }
}