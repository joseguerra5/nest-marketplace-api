import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaSellerRepository } from "./prisma/repositories/prisma-seller-repository";
import { SellerRepository } from "@/domain/marketplace/application/repositories/seller-repository";

@Module({
  providers: [
    PrismaService,
    {
      useClass: PrismaSellerRepository,
      provide: SellerRepository,
    },
  ],
  exports: [
    PrismaService,
    SellerRepository
  ]
})
export class DatabaseModule {}