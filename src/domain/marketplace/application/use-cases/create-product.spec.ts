import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryProductRepository } from "test/repositories/in-memory-produc";
import { CreateProductUseCase } from "./create-product";
import { InMemoryCategoryRepository } from "test/repositories/in-memory-category";
import { makeCategory } from "test/factories/make-category";
import { ValuesNotFoundError } from "./errors/value-not-found";

let inMemoryProductRepository: InMemoryProductRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: CreateProductUseCase

describe("Create a product", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemorySellerRepository = new InMemorySellerRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new CreateProductUseCase(inMemoryProductRepository, inMemorySellerRepository, inMemoryCategoryRepository)
  });
  it("should be able to create a product", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory({}, new UniqueEntityId("test-category"))

    await inMemoryCategoryRepository.create(category)

    const result = await sut.execute({
      attachmentsIds: ["2", "3"],
      categoryId: category.id.toString(),
      description: "Description test",
      priceInCents: 123432,
      sellerId: seller.id.toString(),
      title: "Teste title"
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductRepository.items[0].categoryId).toEqual(category.id)
  })

  it("should be able to create a product with priceInCents", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)
    const category = makeCategory({}, new UniqueEntityId("test-category"))
    await inMemoryCategoryRepository.create(category)


    const result = await sut.execute({
      attachmentsIds: ["2", "3"],
      categoryId: category.id.toString(),
      description: "Description test",
      priceInCents: 1234.32,
      sellerId: seller.id.toString(),
      title: "Teste title"
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductRepository.items[0].priceInCents).toEqual(123432)
  })

  it("should not be able to create a product with inexistent category", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const result = await sut.execute({
      attachmentsIds: ["2", "3"],
      categoryId: "wrong-category",
      description: "Description test",
      priceInCents: 1234.32,
      sellerId: seller.id.toString(),
      title: "Teste title"
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(ValuesNotFoundError)
    expect(inMemoryProductRepository.items).toHaveLength(0)
  })

  it("should not be able to create a product with inexistent attachments", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory({}, new UniqueEntityId("test-category"))
    await inMemoryCategoryRepository.create(category)


    const result = await sut.execute({
      attachmentsIds: [],
      categoryId: category.id.toString(),
      description: "Description test",
      priceInCents: 1234.32,
      sellerId: "1231231",
      title: "Teste title"
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(ValuesNotFoundError)
    expect(inMemoryProductRepository.items).toHaveLength(0)
  })
})