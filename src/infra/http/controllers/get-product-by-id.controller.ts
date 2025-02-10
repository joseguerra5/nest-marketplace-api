import { BadRequestException, ConflictException, Controller, Get, HttpCode, Param } from "@nestjs/common";
import { z } from "zod";
import { ValuesNotFoundError } from "@/domain/marketplace/application/use-cases/errors/value-not-found";
import { GetProductUseCase } from "@/domain/marketplace/application/use-cases/get-product-by-id";

export const getBodySchema = z.object({
  categoryId: z.string(),
  title: z.string(),
  description: z.string(),
  priceInCents: z.number(),
  attachments: z.array(z.string()),
})

export type GetBodySchema = z.infer<typeof getBodySchema>
@Controller("/products/:productId")
export class GetProductByIdController {
  constructor(private sut: GetProductUseCase) {}
  @Get()
  @HttpCode(200)
  async handle(
    @Param("productId") productId: string
){

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