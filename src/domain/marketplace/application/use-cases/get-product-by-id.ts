import { Either, left, right } from "@/core/either"
import { Product } from "../../enterprise/entities/product"
import { ProductRepository } from "../repositories/product-repository"
import { ValuesNotFoundError } from "./errors/value-not-found"

interface GetProductUseCaseRequest {
  productId: string
}

type GetProductUseCaseResponse = Either<ValuesNotFoundError, {
  product: Product
}>

export class GetProductUseCase {
  constructor(
    private productRepository: ProductRepository,
  ) { }

  async execute({
    productId,
  }: GetProductUseCaseRequest): Promise<GetProductUseCaseResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      return left(new ValuesNotFoundError("Product"))
    }

    return right({
      product
    })
  }
}