import { UseCaseError } from "@/core/error/use-case-error";

export class ProductWithSameStatus extends Error implements UseCaseError {
  constructor() {
    super(`The product does not belong to the seller or the product is with the same status.`)
  }
}
