import { BadRequestException, ConflictException, Controller, Get, HttpCode } from "@nestjs/common";
import { ValuesNotFoundError } from "@/domain/marketplace/application/use-cases/errors/value-not-found";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.estrategy";
import { GetSellerProfileUseCase } from "@/domain/marketplace/application/use-cases/get-seller-profile";
import { SellerPresenter } from "../presenters/seller-presenter";

@Controller("/sellers/me")
export class GetSellerProfileController {
  constructor(private sut: GetSellerProfileUseCase) { }
  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user : UserPayload
  ) {
    const userId = user.sub

    const result = await this.sut.execute({
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

    return {
      seller: SellerPresenter.toHttp(result.value.seller)
    }
  }
}