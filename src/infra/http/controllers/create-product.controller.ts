import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.estrategy";
import { CreateProductUseCase } from "@/domain/marketplace/application/use-cases/create-product";
import { ValuesNotFoundError } from "@/domain/marketplace/application/use-cases/errors/value-not-found";

export const createBodySchema = z.object({
  categoryId: z.string(),
  title: z.string(),
  description: z.string(),
  priceInCents: z.number(),
  attachments: z.array(z.string()),
})

export type CreateBodySchema = z.infer<typeof createBodySchema>
@Controller("/products")
export class CreateProductController {
  constructor(private sut: CreateProductUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createBodySchema)) body: CreateBodySchema, 
){
    const {attachments, categoryId, description, priceInCents, title} = body

    const userId = user.sub

    const result = await this.sut.execute({
      attachmentsIds: attachments,
      categoryId,
      description,
      priceInCents,
      sellerId: userId,
      title
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