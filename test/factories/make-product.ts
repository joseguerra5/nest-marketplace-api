import { faker } from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Product, ProductProps } from "@/domain/marketplace/enterprise/entities/product";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaProductMapper } from "@/infra/database/prisma/mappers/prisma-product-mapper";

export function makeProduct(
  overide: Partial<ProductProps> = {},
  id?: UniqueEntityId
) {
  const product = Product.create({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    priceInCents: faker.number.int({max: 10000}),
    sellerId: new UniqueEntityId(),
    categoryId: new UniqueEntityId(),
    ...overide
  }, id)
  return product
}

@Injectable()
export class ProductFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaProduct(
    data: Partial<ProductProps> = {},
  ): Promise<Product> {
    const product = makeProduct(data)

    await this.prisma.product.create({
      data: PrismaProductMapper.toPersistence(product)
    })
  
    return product
  }
}