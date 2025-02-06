import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { AvatarAttachment } from "./avatar-attachment";

export interface SellerProps {
  name: string
  phone: string
  email: string
  password: string
  createdAt: Date
  avatar: AvatarAttachment
  updatedAt?: Date | null
}

export class Seller extends Entity<SellerProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get avatarId() {
    return this.props.avatarId
  }

  set avatarId(avatarId: AvatarAttachment) {
    this.props.avatarId = avatarId
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
    props: Optional<SellerProps, "createdAt" | 'avatar'>, id?: UniqueEntityId
  ): Seller {
    const seller = new Seller({
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, id)

    return seller
  }
}