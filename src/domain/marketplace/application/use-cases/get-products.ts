import { Either, left, right } from "@/core/either"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { ProductRepository } from "../repositories/product-repository"
import { Product, ProductStatus } from "../../enterprise/entities/product"

interface GetProductsUseCaseRequest {
  page: number
  status?: ProductStatus
  search?: string
}

type GetProductsUseCaseResponse = Either<ValuesNotFoundError, {
  products: Product[]
}>

export class GetProductsUseCase {
  constructor(
    private productRepository: ProductRepository,
  ) { }

  async execute({
    page,
    search,
    status
  }: GetProductsUseCaseRequest): Promise<GetProductsUseCaseResponse> {
    const products = await this.productRepository.findManyWithParams({ page, search, status })

    if (!products) {
      return left(new ValuesNotFoundError("Products"))
    }

    return right({
      products
    })
  }
}