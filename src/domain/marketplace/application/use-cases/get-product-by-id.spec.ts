import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryProductRepository } from "test/repositories/in-memory-produc";
import { InMemoryCategoryRepository } from "test/repositories/in-memory-category";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { GetProductUseCase } from "./get-product-by-id";
import { InMemoryAvatarAttachmentRepository } from "test/repositories/in-memory-avatar-attachments-repository";
import { InMemoryProductAttachmentRepository } from "test/repositories/in-memory-product-attachment-repository";

let inMemoryProductRepository: InMemoryProductRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryAvatarAttachmentRepository: InMemoryAvatarAttachmentRepository
let inMemoryProductAttachmentRepository: InMemoryProductAttachmentRepository
let sut: GetProductUseCase

describe("Get product by id", () => {
  beforeEach(() => {
    inMemoryProductAttachmentRepository = new InMemoryProductAttachmentRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryAvatarAttachmentRepository = new InMemoryAvatarAttachmentRepository()
    inMemorySellerRepository = new InMemorySellerRepository(inMemoryAvatarAttachmentRepository)
    inMemoryProductRepository = new InMemoryProductRepository(inMemorySellerRepository, inMemoryCategoryRepository, inMemoryProductAttachmentRepository)
    sut = new GetProductUseCase(inMemoryProductRepository)
  });
  it("should be able to edit a Product", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id })
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      productId: product.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
  })
})