import { Seller } from "../../enterprise/entities/seller";

export abstract class SellerRepository {
  abstract create(seller: Seller): Promise<void>
  abstract save(seller: Seller): Promise<void>
  abstract findByEmail(email: string): Promise<Seller | null>
  abstract findById(id: string): Promise<Seller | null>
  abstract findByPhone(phone: string): Promise<Seller | null>
}