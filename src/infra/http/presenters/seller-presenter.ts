import { Seller } from "@/domain/marketplace/enterprise/entities/seller"

export class SellerPresenter {
  static toHttp(seller: Seller) {
    return {
        id: seller.id.toString(),
        name: seller.name,
        phone: seller.phone,
        email: seller.email,
        avatar: {
          id: seller.avatar.id,
          url: seller.avatar.attachmentId,
        }      
  }
}
}