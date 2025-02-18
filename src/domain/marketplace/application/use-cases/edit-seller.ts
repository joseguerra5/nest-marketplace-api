import { Either, left, right } from "@/core/either";
import { SellerRepository } from "../repositories/seller-repository";
import { Seller } from "../../enterprise/entities/seller";
import { HashGenerator } from "../cryptography/hash-generator";
import { HashComparer } from "../cryptography/hash-comparer";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { PasswordsDoNotMatch } from "./errors/password-dont-match";
import { AlreadyInUseError } from "./errors/already-in-use";
import { Injectable } from "@nestjs/common";
import { AvatarAttachment } from "../../enterprise/entities/avatar-attachment";
import { AvatarAttachmentsRepository } from "../repositories/avatar-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface EditSellerUseCaseRequest {
  sellerId: string
  name: string
  phone: string
  email: string
  attachmentId?: string
  password: string
  newPassword?: string | null
}

type EditSellerUseCaseResponse = Either<NotAllowedError | PasswordsDoNotMatch | AlreadyInUseError, {
  seller: Seller
}>

@Injectable()
export class EditSellerUseCase {
  constructor(
    private sellerRepository: SellerRepository,
    private avatarAttachment: AvatarAttachmentsRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer
  ) { }
  async execute({
    email,
    name,
    password,
    newPassword,
    phone,
    sellerId,
    attachmentId
  }: EditSellerUseCaseRequest): Promise<EditSellerUseCaseResponse> {
    let hasChanges = false
    const seller = await this.sellerRepository.findById(sellerId)

    if (!seller) {
      return left(new NotAllowedError())
    }

    const passwordIsValid = await this.hashComparer.compare(password, seller.password)

    if (!passwordIsValid) {
      return left(new NotAllowedError())
    }

    if (password === newPassword) {
      return left(new PasswordsDoNotMatch())
    }

    if (seller.phone !== phone) {
      const sellerWithSamePhone = await this.sellerRepository.findByPhone(phone)

      if (sellerWithSamePhone) {
        return left(new AlreadyInUseError("Phone"))
      }
    }

    if (seller.email !== email) {
      const sellerWithSameEmail = await this.sellerRepository.findByEmail(email)

      if (sellerWithSameEmail) {
        return left(new AlreadyInUseError("Email"))
      }
    }

    if (newPassword) {
      const hashedPassword = await this.hashGenerator.hash(newPassword)

      if (seller.password !== hashedPassword) {
        seller.password = hashedPassword
        hasChanges = true
      }
    }

    if (seller.email !== email) {
      seller.email = email
      hasChanges = true
    }

    if (seller.name !== name) {
      seller.name = name
      hasChanges = true
    }

    if (seller.phone !== phone) {
      seller.phone = phone
      hasChanges = true
    }

    if (attachmentId) {
      const currentAvatar = await this.avatarAttachment.findBySellerId(sellerId)

      if (currentAvatar?.id.toString() !== attachmentId) {
        const avatarAttachment = AvatarAttachment.create({
          sellerId: new UniqueEntityId(sellerId),
          attachmentId: new UniqueEntityId(attachmentId)
        })

        seller.avatar = avatarAttachment
        hasChanges = true
      }
    }



    if (hasChanges) {
      await this.sellerRepository.save(seller)
    }

    return right({ seller })

  }
}