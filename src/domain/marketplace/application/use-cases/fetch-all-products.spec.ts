import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryProductRepository } from "test/repositories/in-memory-produc";
import { InMemoryCategoryRepository } from "test/repositories/in-memory-category";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { FetchProductsUseCase } from "./fetch-all-products";
import { InMemoryAvatarAttachmentRepository } from "test/repositories/in-memory-avatar-attachments-repository";
import { InMemoryProductAttachmentRepository } from "test/repositories/in-memory-product-attachment-repository";

let inMemoryProductRepository: InMemoryProductRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAvatarAttachmentRepository: InMemoryAvatarAttachmentRepository
let inMemoryProductAttachmentRepository: InMemoryProductAttachmentRepository
let sut: FetchProductsUseCase

describe("Fetch products", () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryAvatarAttachmentRepository = new InMemoryAvatarAttachmentRepository()
    inMemoryProductAttachmentRepository = new InMemoryProductAttachmentRepository()
    inMemorySellerRepository = new InMemorySellerRepository(inMemoryAvatarAttachmentRepository)
    inMemoryProductRepository = new InMemoryProductRepository(inMemorySellerRepository, inMemoryCategoryRepository, inMemoryProductAttachmentRepository)
    sut = new FetchProductsUseCase(inMemoryProductRepository)
  });
  it("should be able to fetch a Products with search params", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id, title: "test" })
    const product2 = makeProduct({ sellerId: seller.id, categoryId: category.id, description: "test", })

    await inMemoryProductRepository.create(product)
    await inMemoryProductRepository.create(product2)

    const result = await sut.execute({
      page: 1,
      search: "TEST"
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value.products).toHaveLength(2)
  })

  it("should be able to fetch a Products with search params", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    for (let i = 1; i <= 22; i++) {
      await inMemoryProductRepository.create(
        makeProduct({ createdAt: new Date(2024, 11, i), sellerId: seller.id, categoryId: category.id, }),
      )
    }

    const result = await sut.execute({
      page: 2,
    })
    expect(result.isRight()).toBeTruthy()
    expect(result.value.products).toHaveLength(2)
    expect(result.value?.products).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 11, 2) }),
      expect.objectContaining({ createdAt: new Date(2024, 11, 1) }),
    ])
  })
})