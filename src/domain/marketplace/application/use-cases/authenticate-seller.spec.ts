import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeSeller } from "test/factories/make-seller";
import { AuthenticateSellerUseCase } from "./authenticate-seller";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

let inMemorySellerRepository: InMemorySellerRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter
let sut: AuthenticateSellerUseCase

describe("RegisterSeller", () => {
  beforeEach(() => {
    inMemorySellerRepository = new InMemorySellerRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateSellerUseCase(inMemorySellerRepository, fakeHasher, encrypter)
  });
  it("should be able to authenticate a seller", async () => {
    const seller = makeSeller({
      password: "test-hashed",
      email: "jhondoe@example.com"
    }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      password: "test",
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(expect.objectContaining({
      accessToken: expect.any(String)
    }))
  })

  it("should not be able to authenticate a seller with wrong credentials(email)", async () => {
    const seller = makeSeller({
      password: "test-hashed",
      email: "jhondoe@example.com"
    }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const result = await sut.execute({
      email: "wrong-email@example.com",
      password: "test",
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).instanceOf(WrongCredentialsError)
  })

  it("should not be able to authenticate a seller with wrong credentials(password)", async () => {
    const seller = makeSeller({
      password: "test-hashed",
      email: "jhondoe@example.com"
    }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const result = await sut.execute({
      email: "jhondoee@example.com",
      password: "wrong-password",
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).instanceOf(WrongCredentialsError)
  })
})