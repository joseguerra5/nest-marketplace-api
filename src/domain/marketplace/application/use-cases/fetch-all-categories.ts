import { Either, left, right } from "@/core/either"
import { ValuesNotFoundError } from "./errors/value-not-found"
import { Category } from "../../enterprise/entities/category"
import { CategoryRepository } from "../repositories/category-repository"

type FetchAllCategoriesUseCaseResponse = Either<ValuesNotFoundError, {
  categories: Category[]
}>

export class FetchAllCategoriesUseCase {
  constructor(
    private categoryRepository: CategoryRepository,
  ) { }

  async execute(): Promise<FetchAllCategoriesUseCaseResponse> {
    const categories = await this.categoryRepository.findAll()

    if (!categories) {
      return left(new ValuesNotFoundError("Categories"))
    }

    return right({
      categories
    })
  }
}