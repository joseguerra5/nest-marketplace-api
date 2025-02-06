import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { RegisterSellerUseCase } from "./register-seller";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeSeller } from "test/factories/make-seller";
import { AlreadyInUseError } from "./errors/already-in-use";

let inMemorySellerRepository: InMemorySellerRepository
let fakeHasher: FakeHasher
let sut: RegisterSellerUseCase

describe("RegisterSeller", () => {
  beforeEach(() => {
    inMemorySellerRepository = new InMemorySellerRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterSellerUseCase(inMemorySellerRepository, fakeHasher)
  });
  it("should be able to register a seller", async () => {
    const result = await sut.execute({
      email: "jhondoe@example.com",
      name: "Jhon Doe",
      password: "123456",
      passwordConfirmation: "123456",
      phone: "123456789",
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({ seller: inMemorySellerRepository.items[0] })
  })
  it("should be able to register a seller with hash password", async () => {
    const result = await sut.execute({
      email: "jhondoe@example.com",
      name: "Jhon Doe",
      password: "123456",
      passwordConfirmation: "123456",
      phone: "123456789",
    })

    const hashedPassword = await fakeHasher.hash("123456")

    expect(result.isRight()).toBeTruthy()
    expect(inMemorySellerRepository.items[0].password).toEqual(hashedPassword)
  })

  it("should not be able to register a seller with same email", async () => {
    const student = makeSeller({ email: "jhondoe@example.com", })

    await inMemorySellerRepository.create(student)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      name: "Jhon Doe",
      password: "123456",
      passwordConfirmation: "123456",
      phone: "123456789",
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(AlreadyInUseError)
  })

  it("should not be able to register a seller with same phone", async () => {
    const student = makeSeller({ phone: "123456789", })

    await inMemorySellerRepository.create(student)

    const result = await sut.execute({
      email: "jhondoe@example.com",
      name: "Jhon Doe",
      password: "123456",
      passwordConfirmation: "123456",
      phone: "123456789",
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(AlreadyInUseError)
  })
})