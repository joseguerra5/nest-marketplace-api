import { AvatarAttachmentsRepository } from "@/domain/marketplace/application/repositories/avatar-repository";
import { SellerRepository } from "@/domain/marketplace/application/repositories/seller-repository";
import { Seller } from "@/domain/marketplace/enterprise/entities/seller";

export class InMemorySellerRepository implements SellerRepository {

  public items: Seller[] = [];

  constructor(
    private avatarAttachmentRepository: AvatarAttachmentsRepository
  ) { }


  async create(seller: Seller): Promise<void> {
    this.items.push(seller);

      await this.avatarAttachmentRepository.create(
        seller.avatar
      )

  }

  async save(seller: Seller): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === seller.id);

    this.items[itemIndex] = seller;

    await this.avatarAttachmentRepository.delete(seller.avatar)
    await this.avatarAttachmentRepository.create(seller.avatar)

    
  }

  async findById(id: string): Promise<Seller | null> {
    const student = this.items.find((item) => item.id.toString() === id);

    if (!student) {
      return null;
    }

    return student;
  }

  async findByEmail(email: string): Promise<Seller | null> {
    const student = this.items.find((item) => item.email === email);

    if (!student) {
      return null;
    }

    return student;
  }

  async findByPhone(phone: string): Promise<Seller | null> {
    const student = this.items.find((item) => item.phone === phone);

    if (!student) {
      return null;
    }

    return student;
  }
}