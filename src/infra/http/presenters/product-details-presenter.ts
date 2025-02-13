import { ProductWithDetails } from "@/domain/marketplace/enterprise/entities/value-objects/product-with-details"

export class ProductDetailsPresenter {
  static toHttp(productDetails: ProductWithDetails) {
    return {
      id: productDetails.productId,
      title: productDetails.title,
      description: productDetails.description,
      priceInCents: productDetails.priceInCents,
      status: productDetails.status,
      owner: {
        id: productDetails.owner.sellerId,
        name: productDetails.owner.name,
        phone: productDetails.owner.phone,
        email: productDetails.owner.email,
        avatar: {
          id: productDetails.owner.avatar,
          url: productDetails.owner.avatar,
        }
      },
      category: {
        id: productDetails.category.categoryId,
        title: productDetails.category.title,
        slug: productDetails.category.slug,
      }
    }
  }
}