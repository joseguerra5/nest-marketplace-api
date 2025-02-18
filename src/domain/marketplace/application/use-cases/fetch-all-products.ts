import { Either, left, right } from "@/core/either"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { ProductRepository } from "../repositories/product-repository"
import { ProductStatus } from "../../enterprise/entities/product"
import { Injectable } from "@nestjs/common"
import { ProductWithDetails } from "../../enterprise/entities/value-objects/product-with-details"

interface FetchProductsUseCaseRequest {
  page: number
  status?: ProductStatus
  search?: string
}

type FetchProductsUseCaseResponse = Either<ValuesNotFoundError, {
  products: ProductWithDetails[]
}>

@Injectable
  ()
export class FetchProductsUseCase {
  constructor(
    private productRepository: ProductRepository,
  ) { }

  async execute({
    page,
    search,
    status
  }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const products = await this.productRepository.findManyWithParamsAndDetails({ page, search, status })

    if (!products) {
      return left(new ValuesNotFoundError("Products"))
    }

    return right({
      products
    })
  }
}