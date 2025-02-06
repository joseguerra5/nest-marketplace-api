import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryProductRepository } from "test/repositories/in-memory-produc";
import { InMemoryCategoryRepository } from "test/repositories/in-memory-category";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { CountSellerAvailableProductsUseCase } from "./count-seller-available-products";
import { ProductStatus } from "../../enterprise/entities/product";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

let inMemoryProductRepository: InMemoryProductRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: CountSellerAvailableProductsUseCase

describe("Get available product count", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemorySellerRepository = new InMemorySellerRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new CountSellerAvailableProductsUseCase(inMemoryProductRepository, inMemorySellerRepository)

    vi.useFakeTimers()
  });

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to get vailable products count for the last 30 days", async () => {
    vi.setSystemTime(new Date(2025, 0, 25, 0, 0, 0))

    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    const seller2 = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test2"))
    await inMemorySellerRepository.create(seller)
    await inMemorySellerRepository.create(seller2)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    for (let i = 1; i <= 22; i++) {
      await inMemoryProductRepository.create(
        makeProduct({ createdAt: new Date(2025, 0, i), sellerId: seller.id, categoryId: category.id, status: ProductStatus.available }),
      )
    }

    for (let i = 1; i <= 22; i++) {
      await inMemoryProductRepository.create(
        makeProduct({ createdAt: new Date(2025, 0, i), sellerId: seller2.id, categoryId: category.id, status: ProductStatus.available }),
      )
    }

    const result = await sut.execute({
      sellerId: seller.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({ amount: 22 })
  })

  it("should not be able to get a available products count for the last 30 days with wrong seller ID", async () => {
    vi.setSystemTime(new Date(2025, 0, 25, 0, 0, 0))

    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    for (let i = 1; i <= 22; i++) {
      await inMemoryProductRepository.create(
        makeProduct({ createdAt: new Date(2025, 0, i), sellerId: seller.id, categoryId: category.id, status: ProductStatus.available }),
      )
    }


    const result = await sut.execute({
      sellerId: "wrong-id",
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})