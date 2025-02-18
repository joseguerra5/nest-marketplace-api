import { BadRequestException, Body, ConflictException, Controller, HttpCode, Put } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.estrategy";
import { ValuesNotFoundError } from "@/domain/marketplace/application/use-cases/errors/value-not-found";
import { EditSellerUseCase } from "@/domain/marketplace/application/use-cases/edit-seller";

export const editBodySchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  password: z.string(),
  newPassword: z.string().optional(),
  avatarId: z.string().optional()
})

export type EditBodySchema = z.infer<typeof editBodySchema>
@Controller("/sellers")
export class EditSellerController {
  constructor(private sut: EditSellerUseCase) { }
  @Put()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(editBodySchema)) body: EditBodySchema,
  ) {
    const { 
      email,
      name,
      password,
      newPassword,
      phone,
      avatarId
    } = body

    const userId = user.sub

    const result = await this.sut.execute({
      email,
      name,
      password,
      newPassword,
      phone,
      sellerId: userId,
      attachmentId: avatarId
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
      seller: result.value.seller
    }
  }
}