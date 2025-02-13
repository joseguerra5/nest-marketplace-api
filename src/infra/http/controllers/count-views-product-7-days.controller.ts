import { BadRequestException, ConflictException, Controller, Get, HttpCode, Param } from "@nestjs/common";
import { ValuesNotFoundError } from "@/domain/marketplace/application/use-cases/errors/value-not-found";
import { CountViewsProduct7daysUseCase } from "@/domain/marketplace/application/use-cases/count-views-product-7-days";

@Controller("/products/:productId/metrics/views")
export class GetCountProductViews7daysController {
  constructor(private sut: CountViewsProduct7daysUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @Param("productId") productId: string
  ) {
    const result = await this.sut.execute({
      productId
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ValuesNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      amount: result.value.amount
    }
  }
}