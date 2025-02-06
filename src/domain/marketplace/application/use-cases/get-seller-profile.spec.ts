import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { GetSellerProfileUseCase } from "./get-seller-profile";

let inMemorySellerRepository: InMemorySellerRepository
let sut: GetSellerProfileUseCase

describe("Get Seller profile", () => {
  beforeEach(() => {
    inMemorySellerRepository = new InMemorySellerRepository()
    sut = new GetSellerProfileUseCase(inMemorySellerRepository)
  });
  it("should be able to get a seller profile", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const result = await sut.execute({
      sellerId: seller.id.toString()
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value.seller).toEqual(inMemorySellerRepository.items[0])
  })
})