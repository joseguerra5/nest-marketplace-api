import { CategoryRepository } from "@/domain/marketplace/application/repositories/category-repository";
import { PrismaService } from "../prisma.service";
import { Category } from "@/domain/marketplace/enterprise/entities/category";
import { PrismaCategoryMapper } from "../mappers/prisma-category-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(
    private prisma: PrismaService,
  ) { }
  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPersistence(category)

    await this.prisma.category.create({
      data,
    })
  }
  async save(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPersistence(category)

    await this.prisma.category.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      }
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany()

    return categories.map(PrismaCategoryMapper.toDomain)
  }
}