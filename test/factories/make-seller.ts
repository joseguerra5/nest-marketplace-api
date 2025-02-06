import { faker } from "@faker-js/faker"
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Seller, SellerProps } from "@/domain/marketplace/enterprise/entities/seller";

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