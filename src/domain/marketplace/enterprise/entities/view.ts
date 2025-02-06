import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface ViewProps {
  productId: UniqueEntityId
  viewerId: UniqueEntityId
  createdAt: Date
}

export class View extends Entity<ViewProps> {
  get productId() {
    return this.props.productId
  }

  set productId(productId: string) {
    this.props.productId = productId
  }

  get viewerId() {
    return this.props.viewerId
  }

  set viewerId(viewerId: string) {
    this.props.viewerId = viewerId
  }



  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<ViewProps, "createdAt">, id?: UniqueEntityId
  ): View {
    const view = new View({
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, id)

    return view
  }
}