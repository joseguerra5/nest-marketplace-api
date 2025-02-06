import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { EditSellerUseCase } from "./edit-seller";
import { AlreadyInUseError } from "./errors/already-in-use";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

let inMemorySellerRepository: InMemorySellerRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeHasher
let sut: EditSellerUseCase

describe("Edit Seller", () => {
  beforeEach(() => {
    inMemorySellerRepository = new InMemorySellerRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeHasher()
    sut = new EditSellerUseCase(inMemorySellerRepository, fakeHasher, fakeEncrypter)
  });
  it("should be able to edit a current seller", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const result = await sut.execute({
      sellerId: "test",
      email: "new-email",
      name: "new-name",
      password: "test",
      phone: "new-phone",
      newPassword: "new-password"
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemorySellerRepository.items[0]).toEqual(expect.objectContaining({
      email: "new-email",
      name: "new-name",
      phone: "new-phone",
      password: "new-password-hashed"
    }))
  })

  it("should not be able to edit a current seller with different id", async () => {
    const seller1 = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller1)

    const seller2 = makeSeller({ email: "johndoe@example.com" })
    await inMemorySellerRepository.create(seller2)

    const result = await sut.execute({
      sellerId: "wrong-id",
      email: "johndoe@example.com",
      name: "new-name",
      password: "test",
      phone: "new-phone",
      newPassword: "new-password"
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).instanceOf(NotAllowedError)

  })

  it("should not be able to edit a current seller with email already in use", async () => {
    const seller1 = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller1)

    const seller2 = makeSeller({ email: "johndoe@example.com" })
    await inMemorySellerRepository.create(seller2)

    const result = await sut.execute({
      sellerId: "test",
      email: "johndoe@example.com",
      name: "new-name",
      password: "test",
      phone: "new-phone",
      newPassword: "new-password"
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).instanceOf(AlreadyInUseError)

  })

  it("should not be able to edit a current seller with phone already in use", async () => {
    const seller1 = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller1)

    const seller2 = makeSeller({ phone: "123456" })
    await inMemorySellerRepository.create(seller2)

    const result = await sut.execute({
      sellerId: "test",
      email: "johndoe@example.com",
      name: "new-name",
      password: "test",
      phone: "123456",
      newPassword: "new-password"
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).instanceOf(AlreadyInUseError)

  })
})