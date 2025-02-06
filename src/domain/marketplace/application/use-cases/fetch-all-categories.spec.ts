import { InMemoryCategoryRepository } from "test/repositories/in-memory-category";
import { makeCategory } from "test/factories/make-category";
import { FetchAllCategoriesUseCase } from "./fetch-all-categories";

let inMemoryCategoryRepository: InMemoryCategoryRepository
let sut: FetchAllCategoriesUseCase

describe("Fetch all categories", () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    sut = new FetchAllCategoriesUseCase(inMemoryCategoryRepository)
  });
  it("should be able to fetch all categories", async () => {
    const category = makeCategory()
    await inMemoryCategoryRepository.create(category)

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value.categories).toHaveLength(1)
  })
})