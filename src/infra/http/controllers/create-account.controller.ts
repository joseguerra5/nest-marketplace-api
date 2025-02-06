import { RegisterSellerUseCase } from "@/domain/marketplace/application/use-cases/register-seller";
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { AlreadyInUseError } from "@/domain/marketplace/application/use-cases/errors/already-in-use";

export const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  passwordConfirmation: z.string().min(8),
  phone: z.string().min(8),

})

export type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>
@Controller("/sellers")
export class CreateAccountController {
  constructor(private createSeller: RegisterSellerUseCase) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema){
    const {email, name, password, passwordConfirmation, phone} = body

    const result = await this.createSeller.execute({
      email,
      name,
      password,
      passwordConfirmation,
      phone
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AlreadyInUseError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}