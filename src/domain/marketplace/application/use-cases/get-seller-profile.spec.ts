import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { GetSellerProfileUseCase } from "./get-seller-profile";
import { InMemoryAvatarAttachmentRepository } from "test/repositories/in-memory-avatar-attachments-repository";

let inMemorySellerRepository: InMemorySellerRepository
let inMemoryAvatarAttachmentRepository: InMemoryAvatarAttachmentRepository
let sut: GetSellerProfileUseCase

describe("Get Seller profile", () => {
  beforeEach(() => {
    inMemoryAvatarAttachmentRepository = new InMemoryAvatarAttachmentRepository()
    inMemorySellerRepository = new InMemorySellerRepository(inMemoryAvatarAttachmentRepository)
    sut = new GetSellerProfileUseCase(inMemorySellerRepository)
  });
  it("should be able to get a seller profile", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const result = await sut.execute({
      sellerId: seller.id.toString()
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.seller).toEqual(inMemorySellerRepository.items[0])
    }
  })
})