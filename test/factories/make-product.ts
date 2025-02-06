import { faker } from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Product, ProductProps } from "@/domain/marketplace/enterprise/entities/product";

export function makeProduct(
  overide: Partial<ProductProps> = {},
  id?: UniqueEntityId
) {
  const product = Product.create({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    priceInCents: faker.number.int(),
    sellerId: new UniqueEntityId(),
    categoryId: new UniqueEntityId(),
    ...overide
  }, id)
  return product
}