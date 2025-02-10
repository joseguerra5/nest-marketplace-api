import { faker } from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Seller, SellerProps } from "@/domain/marketplace/enterprise/entities/seller";
import { Injectable } from "@nestjs/common";
import { PrismaSellerMapper } from "@/infra/database/prisma/mappers/prisma-seller-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeSeller(
  overide: Partial<SellerProps> = {},
  id?: UniqueEntityId
) {
  const seller = Seller.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    password: faker.internet.password(),
    ...overide
  }, id)
  return seller
}

@Injectable()
export class SellerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSeller(
    data: Partial<SellerProps> = {},
  ): Promise<Seller> {
    const seller = makeSeller(data)

    await this.prisma.user.create({
      data: PrismaSellerMapper.toPersistence(seller)
    })
  
    return seller
  }
}