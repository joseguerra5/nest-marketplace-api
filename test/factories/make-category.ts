import { faker } from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Category, CategoryProps } from "@/domain/marketplace/enterprise/entities/category";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { PrismaCategoryMapper } from "@/infra/database/prisma/mappers/prisma-category-mapper";

export function makeCategory(
  overide: Partial<CategoryProps> = {},
  id?: UniqueEntityId
) {
  const category = Category.create({
    slug: faker.lorem.slug(),
    title: faker.lorem.words(),
    ...overide
  }, id)
  return category
}

@Injectable()
export class CategoryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCategory(
    data: Partial<CategoryProps> = {},
  ): Promise<Category> {
    const category = makeCategory(data)

    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPersistence(category)
    })
  
    return category
  }
}