import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryProductRepository } from "test/repositories/in-memory-produc";
import { InMemoryCategoryRepository } from "test/repositories/in-memory-category";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { GetProductsBySellerIdUseCase } from "./get-products-by-seller-id";

let inMemoryProductRepository: InMemoryProductRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: GetProductsBySellerIdUseCase

describe("Get products", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemorySellerRepository = new InMemorySellerRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new GetProductsBySellerIdUseCase(inMemoryProductRepository, inMemorySellerRepository)
  });
  it("should be able to get a Products with search params", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id, title: "test" })
    const product2 = makeProduct({ sellerId: seller.id, categoryId: category.id, description: "test" })
    await inMemoryProductRepository.create(product)
    await inMemoryProductRepository.create(product2)

    const result = await sut.execute({
      page: 1,
      search: "TEST",
      sellerId: seller.id.toString()
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value.products).toHaveLength(2)
  })

  it("should be able to get a Products with search params", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    for (let i = 1; i <= 22; i++) {
      await inMemoryProductRepository.create(
        makeProduct({ createdAt: new Date(2024, 11, i), sellerId: seller.id, categoryId: category.id }),
      )
    }

    const result = await sut.execute({
      page: 2,
      sellerId: seller.id.toString()
    })
    expect(result.isRight()).toBeTruthy()
    expect(result.value.products).toHaveLength(2)
    expect(result.value?.products).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 11, 2) }),
      expect.objectContaining({ createdAt: new Date(2024, 11, 1) }),
    ])
  })
})