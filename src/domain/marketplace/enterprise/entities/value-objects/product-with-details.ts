import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ProductStatus } from "../product";
import { ValueObject } from "@/core/entities/value-object";
import { Seller } from "../seller";
import { Category } from "../category";

export interface ProductWithDetailsProps {
  productId: UniqueEntityId
  title: string
  description: string
  priceInCents: number
  status: ProductStatus
  owner: Seller
  category: Category
}

export class ProductWithDetails extends ValueObject<ProductWithDetails> {
  get productId() {
    return this.props.productId
  }

  get title() {
    return this.props.title
  }
  get description() {
    return this.props.description
  }
  get priceInCents() {
    return this.props.priceInCents
  }
  get status() {
    return this.props.status
  }
  get owner() {
    return this.props.owner
  }
  get category() {
    return this.props.category
  }


  static create(props: ProductWithDetailsProps): ProductWithDetails {
    return new ProductWithDetails(props)
  }
}