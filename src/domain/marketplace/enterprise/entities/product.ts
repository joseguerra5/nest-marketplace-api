import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ProductAttachmentList } from "./product-attachment-list";
import { Optional } from "@/core/types/optional";

export enum ProductStatus {
  available = "available",
  cancelled = "cancelled",
  sold = "sold",
}

export interface ProductProps {
  categoryId: UniqueEntityId
  sellerId: UniqueEntityId
  title: string
  description: string
  priceInCents: number
  attachments: ProductAttachmentList
  status: ProductStatus | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Product extends Entity<ProductProps> {
  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  get sellerId() {
    return this.props.sellerId
  }

  get categoryId() {
    return this.props.categoryId
  }

  set categoryId(categoryId: string) {
    this.props.categoryId = categoryId
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get priceInCents() {
    return this.props.priceInCents
  }

  set priceInCents(priceInCents: number) {


    if (isNaN(priceInCents)) {
      throw new Error("priceInCents inválido.");
    }

    if (Number.isInteger(priceInCents) && priceInCents > 100) {
      this.props.priceInCents = priceInCents
      this.touch()
      return
    }
    Math.round(priceInCents * 100);
    this.props.priceInCents = priceInCents
    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: ProductAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }
  get status() {
    return this.props.status
  }

  set status(status: ProductStatus) {
    this.props.status = status
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ProductProps, "createdAt" | "attachments" | "status">, id?: UniqueEntityId
  ): Product {
    const product = new Product({
      ...props,
      status: props.status ?? ProductStatus.available,
      createdAt: props.createdAt ?? new Date()
    }, id)

    return product
  }
}