import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryProductRepository } from "test/repositories/in-memory-produc";
import { InMemoryCategoryRepository } from "test/repositories/in-memory-category";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { ProductStatus } from "../../enterprise/entities/product";
import { InMemoryViewRepository } from "test/repositories/in-memory-view-repository";
import { makeView } from "test/factories/make-view";
import { CountViewsProduct7daysUseCase } from "./count-views-product-7-days";

let inMemoryProductRepository: InMemoryProductRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryViewRepository: InMemoryViewRepository
let sut: CountViewsProduct7daysUseCase

describe("Get product view count", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemorySellerRepository = new InMemorySellerRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryViewRepository = new InMemoryViewRepository(inMemoryProductRepository)
    sut = new CountViewsProduct7daysUseCase(inMemoryProductRepository, inMemoryViewRepository)

    vi.useFakeTimers()
  });

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to get a product view count for the last 7 days", async () => {
    vi.setSystemTime(new Date(2025, 0, 23, 0, 0, 0))

    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    const seller2 = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test2"))
    await inMemorySellerRepository.create(seller)
    await inMemorySellerRepository.create(seller2)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    await inMemoryProductRepository.create(
      makeProduct({ sellerId: seller.id, categoryId: category.id, status: ProductStatus.sold }, new UniqueEntityId(`test`)),
    )

    for (let i = 1; i <= 22; i++) {
      await inMemoryViewRepository.create(
        makeView({
          viewerId: seller2.id,
          productId: new UniqueEntityId(`test`),
          createdAt: new Date(2025, 0, i, 0, 0, 0)
        })
      )
    }

    const result = await sut.execute({
      productId: "test"
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({ amount: 7 })
  })
})