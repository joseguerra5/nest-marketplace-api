import { Either, left, right } from "@/core/either"
import { ProductRepository } from "../repositories/product-repository"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { Injectable } from "@nestjs/common"
import { ProductWithDetails } from "../../enterprise/entities/value-objects/product-with-details"

interface GetProductUseCaseRequest {
  productId: string
}

type GetProductUseCaseResponse = Either<ValuesNotFoundError, {
  product: ProductWithDetails
}>

@Injectable()
export class GetProductUseCase {
  constructor(
    private productRepository: ProductRepository,
  ) { }

  async execute({
    productId,
  }: GetProductUseCaseRequest): Promise<GetProductUseCaseResponse> {
    const product = await this.productRepository.findByIdWithDetails(productId)

    if (!product) {
      return left(new ValuesNotFoundError("Product"))
    }

    return right({
      product
    })
  }
}