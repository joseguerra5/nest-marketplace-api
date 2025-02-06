import { Either, left, right } from "@/core/either"
import { SellerRepository } from "../repositories/seller-repository"
import { Seller } from "../../enterprise/entities/seller"
import { HashGenerator } from "../cryptography/hash-generator"
import { AlreadyInUseError } from "./errors/already-in-use"
import { PasswordsDoNotMatch } from "./errors/password-dont-match"
import { AvatarAttachment } from "../../enterprise/entities/avatar-attachment"
import { UniqueEntityId } from "@/core/entities/unique-entity-id"

interface RegisterSellerUseCaseRequest {
  name: string
  phone: string
  email: string
  password: string
  passwordConfirmation: string
  avatarId: string
}

type RegisterSellerUseCaseResponse = Either<AlreadyInUseError | PasswordsDoNotMatch, {
  seller: Seller
}>

export class RegisterSellerUseCase {
  constructor(
    private sellerRepository: SellerRepository,
    private hashGenerator: HashGenerator,

  ) { }

  async execute({
    name,
    phone,
    email,
    password,
    passwordConfirmation,
    avatarId,
  }: RegisterSellerUseCaseRequest): Promise<RegisterSellerUseCaseResponse> {
    const sellerWithSameEmail = await this.sellerRepository.findByEmail(email)

    if (sellerWithSameEmail) {
      return left(new AlreadyInUseError('Email'))
    }

    const sellerWithSamePhone = await this.sellerRepository.findByPhone(phone)

    if (sellerWithSamePhone) {
      return left(new AlreadyInUseError('Phone'))
    }

    if (password !== passwordConfirmation) {
      return left(new PasswordsDoNotMatch())
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const seller = Seller.create({
      name,
      phone,
      email,
      password: passwordHash
    })

    seller.avatarId = AvatarAttachment.create({
      attachmentId: new UniqueEntityId(avatarId),
      sellerId: seller.id
    })


    await this.sellerRepository.create(seller)

    return right({
      seller
    })
  }
}