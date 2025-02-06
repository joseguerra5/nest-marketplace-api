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
import { CountSellerViewsPerDayUseCase } from "./count-seller-views-per-day";

let inMemoryProductRepository: InMemoryProductRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryViewRepository: InMemoryViewRepository
let sut: CountSellerViewsPerDayUseCase

describe("Get seller views count per day", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemorySellerRepository = new InMemorySellerRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryViewRepository = new InMemoryViewRepository(inMemoryProductRepository)
    sut = new CountSellerViewsPerDayUseCase(inMemorySellerRepository, inMemoryViewRepository)

    vi.useFakeTimers()
  });

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to get a seller views count per day for the last 30 days", async () => {
    vi.setSystemTime(new Date(2025, 0, 25, 0, 0, 0))

    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    const seller2 = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test2"))
    await inMemorySellerRepository.create(seller)
    await inMemorySellerRepository.create(seller2)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    for (let i = 1; i <= 22; i++) {
      await inMemoryProductRepository.create(
        makeProduct({ createdAt: new Date(2025, 0, i), sellerId: seller.id, categoryId: category.id, status: ProductStatus.sold }, new UniqueEntityId(`test-${i}`)),
      )
    }

    for (let i = 1; i <= 22; i++) {
      await inMemoryViewRepository.create(
        makeView({
          viewerId: seller2.id,
          productId: new UniqueEntityId(`test-${i}`),
          createdAt: new Date(2025, 0, i)
        })
      )
    }

    const result = await sut.execute({
      sellerId: seller.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.viewsPerDay).toHaveLength(22)
    }
  })
})