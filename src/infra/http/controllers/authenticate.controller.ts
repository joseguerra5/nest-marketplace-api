import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { Public } from "@/infra/auth/public";
import { AuthenticateSellerUseCase } from "@/domain/marketplace/application/use-cases/authenticate-seller";
import { WrongCredentialsError } from "@/domain/marketplace/application/use-cases/errors/wrong-credentials-error";

export const authenticateAccountBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type AuthenticateAccountBodySchema = z.infer<typeof authenticateAccountBodySchema>
@Controller("/session")
@Public()
export class AuthenticateAccountController {
  constructor(private sut: AuthenticateSellerUseCase) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateAccountBodySchema))
  async handle(@Body() body: AuthenticateAccountBodySchema){
    const {email, password} = body

    const result = await this.sut.execute({
      email,
      password
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken
    }
  }
}