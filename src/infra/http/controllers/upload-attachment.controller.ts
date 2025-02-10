import { BadRequestException, Controller, FileTypeValidator, HttpCode, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { z } from "zod";
import { UploadAndCreateAttachmentUseCase } from "@/domain/marketplace/application/use-cases/upload-and-create-attachment";
import { FileInterceptor } from "@nestjs/platform-express";
import { InvalidAttachmentTypeError } from "@/domain/marketplace/application/use-cases/errors/invalid-attachment-type-error";

export const createBodySchema = z.object({
  categoryId: z.string(),
  title: z.string(),
  description: z.string(),
  priceInCents: z.number(),
  attachments: z.array(z.string()),
})

export type CreateBodySchema = z.infer<typeof createBodySchema>
@Controller("/attachments")
export class UploadAttachmentController {
  constructor(private sut: UploadAndCreateAttachmentUseCase) {}
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2 // 2mb
          }),
          new FileTypeValidator({
            fileType: ".(png|jpg|jpeg|pdf)"
          }),
        ],
      }),
    )
    file: Express.Multer.File
){
    const result = await this.sut.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer
    })

    console.log(result.value)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const {attachment} = result.value

    return {
      attachmentId : attachment.id.toString()
    }
  }
}