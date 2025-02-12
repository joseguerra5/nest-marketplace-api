import { SellerRepository } from "@/domain/marketplace/application/repositories/seller-repository";
import { PrismaService } from "../prisma.service";
import { Seller } from "@/domain/marketplace/enterprise/entities/seller";
import { PrismaSellerMapper } from "../mappers/prisma-seller-mapper";
import { AvatarAttachmentsRepository } from "@/domain/marketplace/application/repositories/avatar-repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaSellerRepository implements SellerRepository {
  constructor(
    private prisma: PrismaService,
    private avatarAttachmentRepository: AvatarAttachmentsRepository
  ) { }

  async create(seller: Seller): Promise<void> {
    const data = PrismaSellerMapper.toPersistence(seller);

    await this.prisma.user.create({ data })
  }
  async save(seller: Seller): Promise<void> {
    const data = PrismaSellerMapper.toPersistence(seller);

    await Promise.all([
      this.prisma.user.update({
        where: {
          id: data.id
        },
        data,
      }),

      this.avatarAttachmentRepository.create(
        seller.avatar
      ),

      this.avatarAttachmentRepository.deleteBySellerId(
        seller.id.toString()
      ),
    ])
  }
  async findByEmail(email: string): Promise<Seller | null> {
    const seller = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!seller) {
      return null
    }

    return PrismaSellerMapper.toDomain(seller)
  }
  async findById(id: string): Promise<Seller | null> {
    const seller = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!seller) {
      return null
    }

    return PrismaSellerMapper.toDomain(seller)
  }
  async findByPhone(phone: string): Promise<Seller | null> {
    const seller = await this.prisma.user.findUnique({
      where: {
        phone
      }
    })

    if (!seller) {
      return null
    }

    return PrismaSellerMapper.toDomain(seller)
  }
}