import { CountByProduct, CountBySeller, ViewRepository, ViewsPerDay } from "@/domain/marketplace/application/repositories/view-repository";
import { PrismaService } from "../prisma.service";
import { View } from "@/domain/marketplace/enterprise/entities/view";
import { PrismaViewMapper } from "../mappers/prisma-view-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaViewRepository implements ViewRepository {
  constructor(
    private prisma: PrismaService,
  ) { }
  async create(view: View): Promise<void> {
    const data = PrismaViewMapper.toPersistence(view);

    await this.prisma.view.create({ data })
  }
  async findByViewerId(viewerId: string, productId: string): Promise<View | null> {
    const view = await this.prisma.view.findFirst({
      where: {
        viewerId,
        productId,
      }
    })

    if (!view) {
      return null
    }


    return PrismaViewMapper.toDomain(view)
  }
  async findManyByProductId(productId: string): Promise<View[]> {
    const views = await this.prisma.view.findMany({
      where: {
        productId,
      }
    })


    return views.map(PrismaViewMapper.toDomain)
  }
  async countBySeller({ from, sellerId }: CountBySeller): Promise<number> {
    const count = await this.prisma.view.count({
      where: {
        viewerId: sellerId,
        createdAt:
          from ? { gte: new Date(from) } : undefined,
      }
    })

    return count
  }
  async countPerDay({ from, sellerId }: CountBySeller): Promise<ViewsPerDay[]> {
    const result = await this.prisma.product.findMany({
      where: {
        sellerId,
        createdAt:
          from ? { gte: new Date(from) } : undefined,
      },
      select: {
        createdAt: true
      }
    })

    const groupedByDate = result.reduce((acc, product) => {
      const date = product.createdAt.toISOString().split("T")[0]

      if (!acc[date]) {
        acc[date] = { date: new Date(date), amount: 1 }
      } else {
        acc[date].amount += 1
      }

      return acc
    }, {} as Record<string, ViewsPerDay>)

    return Object.values(groupedByDate)
  }
  async countByProduct({ from, productId }: CountByProduct): Promise<number> {
    const count = await this.prisma.view.count({
      where: {
        productId,
        createdAt:
          from ? { gte: new Date(from) } : undefined,
      }
    })

    return count
  }

}