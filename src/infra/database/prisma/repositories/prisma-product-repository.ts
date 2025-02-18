import { Count, ProductRepository } from "@/domain/marketplace/application/repositories/product-repository";
import { PrismaService } from "../prisma.service";
import { PaginationParams, PaginationProductsParams } from "@/core/repositories/pagination-params";
import { Product } from "@/domain/marketplace/enterprise/entities/product";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { ProductAttachmentsRepository } from "@/domain/marketplace/application/repositories/product-attachment-repository";
import { ProductStatus } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { ProductWithDetails } from "@/domain/marketplace/enterprise/entities/value-objects/product-with-details";
import { PrismaProductWithDetailsMapper } from "../mappers/prisma-product-with-details";

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(
    private prisma: PrismaService,
    private productAttachmentRepository: ProductAttachmentsRepository
  ) { }
  async findManyWithParamsAndDetails({page, search, sellerId, status}: PaginationProductsParams): Promise<ProductWithDetails[]> {
    const products = await this.prisma.product.findMany({
      where: {
        sellerId,
        status: status ? status.toUpperCase() as ProductStatus : undefined,
        OR: search ? [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } }
        ] : undefined
      },
      include: {
        seller: true,
        category: true,
        attachments: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return products.map(PrismaProductWithDetailsMapper.toDomain);
  }
  async findByIdWithDetails(id: string): Promise<ProductWithDetails | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        seller: true,
        category: true,
        attachments: true
      }
    })

    if (!product) {
      return null
    }

    return PrismaProductWithDetailsMapper.toDomain(product)
  }
  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    await this.prisma.product.create({
      data
    })

    await this.productAttachmentRepository.createMany(product.attachments.getItems())
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPersistence(product)

    if (product.attachments) {
      await Promise.all([
        this.prisma.product.update({
          where: {
            id: data.id,
          },
          data,
        }),

        this.productAttachmentRepository.createMany(
          product.attachments.getNewItems()
        ),

        this.productAttachmentRepository.deleteMany(
          product.attachments.getRemovedItems()
        )
      ])
    } else {
      await this.prisma.product.update({
        where: {
          id: data.id,
        },
        data,
      })
    }
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      }
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async findManyBySellerId(sellerId: string, { page }: PaginationParams): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        sellerId,
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return products.map(PrismaProductMapper.toDomain)
  }
  async findAllBySellerId(sellerId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        sellerId,
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return products.map(PrismaProductMapper.toDomain);
  }
  async count({ sellerId, from, status }: Count): Promise<number> {
    const count = await this.prisma.product.count({
      where: {
        sellerId,
        createdAt:
          from ? { gte: new Date(from) } : undefined,
        status: status ? status.toUpperCase() as ProductStatus : undefined,
      }
    })

    return count
  }
  async findMany({ page }: PaginationParams): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return products.map(PrismaProductMapper.toDomain);
  }
  async findManyWithParams({ page, search, sellerId, status }: PaginationProductsParams): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        sellerId,
        status: status ? status.toUpperCase() as ProductStatus : undefined,
        OR: search ? [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } }
        ] : undefined
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20,
      skip: (page - 1) * 20
    })

    return products.map(PrismaProductMapper.toDomain);
  }
}