import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryProductRepository } from "test/repositories/in-memory-produc";
import { InMemoryCategoryRepository } from "test/repositories/in-memory-category";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { RegisterViewerUseCase } from "./register-viewer-product";
import { InMemoryViewRepository } from "test/repositories/in-memory-view-repository";
import { ViewerIsOwnerProduct } from "./errors/viewer-ownew-product";

let inMemoryProductRepository: InMemoryProductRepository
let inMemoryViewRepository: InMemoryViewRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: RegisterViewerUseCase

describe("Register viwer", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemorySellerRepository = new InMemorySellerRepository()
    inMemoryViewRepository = new InMemoryViewRepository(inMemoryProductRepository)
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new RegisterViewerUseCase(inMemoryViewRepository, inMemoryProductRepository, inMemorySellerRepository)
  });
  it("should be able to register a viewer", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    const seller2 = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test2"))
    await inMemorySellerRepository.create(seller)
    await inMemorySellerRepository.create(seller2)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id })
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      viewerId: "test2",
      productId: product.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryViewRepository.items).toHaveLength(1)
  })

  it("should not be able to register twice a viewer", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    const seller2 = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test2"))
    await inMemorySellerRepository.create(seller)
    await inMemorySellerRepository.create(seller2)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id })
    await inMemoryProductRepository.create(product)

    await sut.execute({
      viewerId: "test2",
      productId: product.id.toString(),
    })

    const result = await sut.execute({
      viewerId: "test2",
      productId: product.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(inMemoryViewRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(ViewerIsOwnerProduct)
  })

  it("should not be able to register a viewer with the owner of product", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    const seller2 = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test2"))
    await inMemorySellerRepository.create(seller)
    await inMemorySellerRepository.create(seller2)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id })
    await inMemoryProductRepository.create(product)


    const result = await sut.execute({
      viewerId: "test",
      productId: product.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(inMemoryViewRepository.items).toHaveLength(0)
    expect(result.value).toBeInstanceOf(ViewerIsOwnerProduct)
  })
})