import { BadRequestException, ConflictException, Controller, HttpCode, Param, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.estrategy";
import { ValuesNotFoundError } from "@/domain/marketplace/application/use-cases/errors/value-not-found";
import { RegisterViewerUseCase } from "@/domain/marketplace/application/use-cases/register-viewer-product";

@Controller("/products/:productId/views")
export class RegisterViewController {
  constructor(private sut: RegisterViewerUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("productId") productId: string
){

    const userId = user.sub

    const result = await this.sut.execute({
      productId,
      viewerId: userId
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