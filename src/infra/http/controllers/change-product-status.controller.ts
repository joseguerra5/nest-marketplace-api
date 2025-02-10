import { BadRequestException, ConflictException, Controller, HttpCode, Param, Patch } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.estrategy";
import { ValuesNotFoundError } from "@/domain/marketplace/application/use-cases/errors/value-not-found";
import { ChangeProductStatusBySellerIdUseCase } from "@/domain/marketplace/application/use-cases/change-product-status";
import { ProductStatus } from "@/domain/marketplace/enterprise/entities/product";
import { ProductStatusValidationPipe } from "../pipes/product-validation-pipe";

@Controller("/products/:productId/:status")
export class ChangeProductStatusController {
  constructor(private sut: ChangeProductStatusBySellerIdUseCase) {}
  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("productId") productId: string,
    @Param("status", ProductStatusValidationPipe) status: ProductStatus,
){
   const userId = user.sub

    const result = await this.sut.execute({
      productId,
      status,
      sellerId: userId,
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
  }
}