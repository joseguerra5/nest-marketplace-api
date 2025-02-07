import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaSellerRepository } from "./prisma/repositories/prisma-seller-repository";
import { SellerRepository } from "@/domain/marketplace/application/repositories/seller-repository";
import { PrismaAttachmentRepository } from "./prisma/repositories/prisma-attachment-repository";
import { AttachmentsRepository } from "@/domain/marketplace/application/repositories/attachment-repository";
import { PrismaAvatarRepository } from "./prisma/repositories/prisma-avatar-repository";
import { AvatarAttachmentsRepository } from "@/domain/marketplace/application/repositories/avatar-repository";
import { PrismaCategoryRepository } from "./prisma/repositories/prisma-category-repository";
import { CategoryRepository } from "@/domain/marketplace/application/repositories/category-repository";
import { PrismaProductAttachmentRepository } from "./prisma/repositories/prisma-product-attachment-repository";
import { ProductAttachmentsRepository } from "@/domain/marketplace/application/repositories/product-attachment-repository";
import { PrismaProductRepository } from "./prisma/repositories/prisma-product-repository";
import { ProductRepository } from "@/domain/marketplace/application/repositories/product-repository";
import { PrismaViewRepository } from "./prisma/repositories/prisma-view-repository";
import { ViewRepository } from "@/domain/marketplace/application/repositories/view-repository";

@Module({
  providers: [
    PrismaService,
    {
      useClass: PrismaSellerRepository,
      provide: SellerRepository,
    },
    {
      useClass: PrismaAttachmentRepository,
      provide: AttachmentsRepository,
    },
    {
      useClass: PrismaAvatarRepository,
      provide: AvatarAttachmentsRepository,
    },
    {
      useClass: PrismaCategoryRepository,
      provide: CategoryRepository,
    },
    {
      useClass: PrismaProductAttachmentRepository,
      provide: ProductAttachmentsRepository,
    },
    {
      useClass: PrismaProductRepository,
      provide: ProductRepository,
    },
    {
      useClass: PrismaViewRepository,
      provide: ViewRepository,
    },
  ],
  exports: [
    PrismaService,
    SellerRepository,
    AttachmentsRepository,
    AvatarAttachmentsRepository,
    CategoryRepository,
    ProductAttachmentsRepository,
    ProductRepository,
    ViewRepository
  ]
})
export class DatabaseModule { }