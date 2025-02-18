import { BadRequestException, ConflictException, Controller, Get, HttpCode } from "@nestjs/common";
import { ValuesNotFoundError } from "@/domain/marketplace/application/use-cases/errors/value-not-found";
import { FetchAllCategoriesUseCase } from "@/domain/marketplace/application/use-cases/fetch-all-categories";
import { CategoriesPresenter } from "../presenters/category-presenter";
import { Public } from "@/infra/auth/public";


@Controller("/categories")
export class FetchAllCategoriesController {
  constructor(private sut: FetchAllCategoriesUseCase) { }
  @Public()
  @Get()
  @HttpCode(200)
  async handle() {

    const result = await this.sut.execute()

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ValuesNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const categories = result.value.categories

    return {
      categories: categories.map(CategoriesPresenter.toHttp)
    }
  }
}