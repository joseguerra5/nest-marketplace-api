import { UseCaseError } from "@/core/error/use-case-error";

export class ValuesNotFoundError extends Error implements UseCaseError {
  constructor(value: string) {
    super(
      `${value} not found`
    )
  }
}