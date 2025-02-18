import { BadRequestException, ConflictException, Controller, Get, HttpCode, Param } from "@nestjs/common";
import { ValuesNotFoundError } from "@/domain/marketplace/application/use-cases/errors/value-not-found";
import { GetProductUseCase } from "@/domain/marketplace/application/use-cases/get-product-by-id";
import { ProductDetailsPresenter } from "../presenters/product-details-presenter";


@Controller("/products/:productId")
export class GetProductByIdController {
  constructor(private sut: GetProductUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @Param("productId") productId: string
  ) {

    const result = await this.sut.execute({
      productId,
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
      product: ProductDetailsPresenter.toHttp(result.value.product)
    }
  }
}