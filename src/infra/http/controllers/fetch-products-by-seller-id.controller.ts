import { BadRequestException, ConflictException, Controller, Get, HttpCode, Query } from "@nestjs/common";
import { z } from "zod";
import { ValuesNotFoundError } from "@/domain/marketplace/application/use-cases/errors/value-not-found";
import { ProductDetailsPresenter } from "../presenters/product-details-presenter";
import { FetchProductsBySellerIdUseCase } from "@/domain/marketplace/application/use-cases/fetch-products-by-seller-id";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.estrategy";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { ProductStatus } from "@/domain/marketplace/enterprise/entities/product";

export const fetchBodySchema = z.object({
    page: z.string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
    status: z.string().optional(),
    search: z.string().optional(),
})

export type FetchBodySchema = z.infer<typeof fetchBodySchema>
@Controller("/products/me")
export class FetchProductsBySellerIdController {
  constructor(private sut: FetchProductsBySellerIdUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ZodValidationPipe(fetchBodySchema)) query: FetchBodySchema
  ) {
    const userId = user.sub
    const {page, search} = query

    let status: ProductStatus | undefined;
    
    if (query.status) {
      status = ProductStatus[query.status.toUpperCase() as keyof typeof ProductStatus] || undefined;
    }

    const result = await this.sut.execute({
      page,
      sellerId: userId,
      search,
      status,
    })

    console.log(result)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ValuesNotFoundError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const products = result.value.products

    return {
      product: products.map(ProductDetailsPresenter.toHttp)
    }
  }
}