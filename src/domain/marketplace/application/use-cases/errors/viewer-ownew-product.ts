import { UseCaseError } from "@/core/error/use-case-error";

export class ViewerIsOwnerProduct extends Error implements UseCaseError {
  constructor() {
    super(`The viewer is the owner of the product or already register.`)
  }
}
