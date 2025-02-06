import { InMemorySellerRepository } from "test/repositories/in-memory-seller-repository";
import { makeSeller } from "test/factories/make-seller";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryProductRepository } from "test/repositories/in-memory-produc";
import { InMemoryCategoryRepository } from "test/repositories/in-memory-category";
import { EditProductUseCase } from "./edit-product";
import { InMemoryProductAttachmentRepository } from "test/repositories/in-memory-product-attachment-repository";
import { makeCategory } from "test/factories/make-category";
import { makeProduct } from "test/factories/make-product";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ValuesNotFoundError } from "./errors/value-not-found";
import { ProductStatus } from "../../enterprise/entities/product";
import { makeProductAttachment } from "test/factories/make-product-attachment";

let inMemoryProductRepository: InMemoryProductRepository
let inMemoryProductAttachmentRepository: InMemoryProductAttachmentRepository
let inMemorySellerRepository: InMemorySellerRepository
let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: EditProductUseCase

describe("Edit Seller", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryProductAttachmentRepository = new InMemoryProductAttachmentRepository()
    inMemorySellerRepository = new InMemorySellerRepository()
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new EditProductUseCase(inMemoryProductRepository, inMemoryProductAttachmentRepository, inMemoryCategoryRepository)
  });
  it("should be able to edit a Product", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id })
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      productId: product.id.toString(),
      attachmentsIds: ["2", "3"],
      categoryId: category.id.toString(),
      description: "Description test",
      priceInCents: 123432,
      title: "Teste title"
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryProductRepository.items[0]).toEqual(expect.objectContaining({
      description: "Description test",
      priceInCents: 123432,
      title: "Teste title"
    }))
  })

  it("should not be able to edit a Product with different seller ID", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id })
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      sellerId: "wrong-seller-id",
      productId: product.id.toString(),
      attachmentsIds: ["2", "3"],
      categoryId: category.id.toString(),
      description: "Description test",
      priceInCents: 123432,
      title: "Teste title"
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it("should not be able to edit a Product with inexistent categoryId", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id })
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      productId: product.id.toString(),
      attachmentsIds: ["2", "3"],
      categoryId: "wrong-category-id",
      description: "Description test",
      priceInCents: 123432,
      title: "Teste title"
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ValuesNotFoundError)
  })

  it("should not be able to edit a Product with inexistent categoryId", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id, status: ProductStatus.sold })
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      productId: product.id.toString(),
      attachmentsIds: ["2", "3"],
      categoryId: "wrong-category-id",
      description: "Description test",
      priceInCents: 123432,
      title: "Teste title"
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it("should sync new and removed attachments when editing a product", async () => {
    const seller = makeSeller({ password: "test-hashed" }, new UniqueEntityId("test"))
    await inMemorySellerRepository.create(seller)

    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const product = makeProduct({ sellerId: seller.id, categoryId: category.id })
    await inMemoryProductRepository.create(product)

    inMemoryProductAttachmentRepository.items.push(
      makeProductAttachment({ productId: product.id, attachmentId: new UniqueEntityId("1") }),
      makeProductAttachment({ productId: product.id, attachmentId: new UniqueEntityId("2") }),
      makeProductAttachment({ productId: product.id, attachmentId: new UniqueEntityId("5") }),
    )

    const result = await sut.execute({
      sellerId: seller.id.toString(),
      productId: product.id.toString(),
      attachmentsIds: ["1", "7"],
      categoryId: category.id.toString(),
      description: "Description test",
      priceInCents: 123432,
      title: "Teste title"
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryProductRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('7') }),
    ],)
  })
})