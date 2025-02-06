import { UniqueEntityId } from "./unique-entity-id"

export class Entity<Props> {
  private _id: UniqueEntityId
  protected props: any

  get id() {
    return this._id
  }

  public equals(entity: Entity<Props>): boolean {
    if (this === entity) {
      return true
    }

    if (entity._id === this._id) {
      return true
    }

    return false
  }

  protected constructor(props: any, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }
}