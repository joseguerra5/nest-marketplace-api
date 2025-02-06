import { Either, left, right } from "@/core/either"
import { AttachmentsRepository } from "../repositories/attachment-repository"
import { Attachment } from "../../enterprise/entities/attachment"
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error"
import { Uploader } from "../storage/uploader"

interface UploadAndCreateAttachmentUseCaseRequest {
  body: Buffer
  fileName: string
  fileType: string
}

type UploadAndCreateAttachmentUseCaseResponse = Either<InvalidAttachmentTypeError, {
  attachment: Attachment
}>

export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) { }

  async execute({
    body,
    fileName,
    fileType
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    // regex para verificar formato dos arquivos
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    // O caso de uso vai chamar o repositorio externo que faz o upload 
    const {url} = await this.uploader.upload({
      body,
      fileName,
      fileType
    })

    const attachment = Attachment.create({
      title: fileName,
      url
    })

    // chamo agora o repositorio passando o titulo do arquivo e a url para resgatar o arquivo em um rep externo
    await this.attachmentRepository.create(attachment)

    return right({
      attachment
    })
  }
}