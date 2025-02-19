import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryProductRepository } from "test/repositories/in-memory-produc";
import { InMemoryCategoryRepository } from "test/repositories/in-memory-category";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { ChangeProductStatusBySellerIdUseCase } from "./change-product-status";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ProductWithSameStatus } from "./errors/same-status";
import { ProductStatus } from "../../enterprise/entities/product";
import { InMemoryProductAttachmentRepository } from "test/repositories/in-memory-product-attachment-repository";
import { InMemoryAvatarAttachmentRepository } from "test/repositories/in-memory-avatar-attachments-repository";

let inMemoryProductRepository: InMemoryProductRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let inMemoryProductAttachmentRepository: InMemoryProductAttachmentRepository
let inMemorAvatarAttachmentRepository: InMemoryAvatarAttachmentRepository
let sut: ChangeProductStatusBySellerIdUseCase

describe("Edit Seller", () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    inMemoryProductAttachmentRepository = new InMemoryProductAttachmentRepository()
    inMemorAvatarAttachmentRepository = new InMemoryAvatarAttachmentRepository()
    inMemoryProductRepository = new InMemoryProductRepository(inMemorySellerRepository, inMemoryCategoryRepository, inMemoryProductAttachmentRepository)
    inMemorySellerRepository = new InMemorySellerRepository(inMemorAvatarAttachmentRepository)
    sut = new ChangeProductStatusBySellerIdUseCase(inMemoryProductRepository, inMemorySellerRepository)
  });
  it("should be able to change a Product status", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id })
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      productId: product.id.toString(),
      status: ProductStatus.cancelled
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryProductRepository.items[0]).toEqual(expect.objectContaining({
      status: "CANCELLED"
    }))
  })

  it("should not be able to change a Product status to cancelled when the product is sold", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id, status: ProductStatus.sold })
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      productId: product.id.toString(),
      status: ProductStatus.cancelled
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).instanceOf(ProductWithSameStatus)
    expect(inMemoryProductRepository.items[0]).toEqual(expect.objectContaining({
      status: "SOLD"
    }))
  })

  it("should not be able to change a Product status with different sellerId", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id, status: ProductStatus.sold })
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      sellerId: "wrong-seller-id",
      productId: product.id.toString(),
      status: ProductStatus.cancelled
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).instanceOf(NotAllowedError)
  })
})