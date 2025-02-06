import { UseCaseError } from "@/core/error/use-case-error";

export class AlreadyInUseError extends Error implements UseCaseError {
  constructor(value: string) {
    super(
      `${value} already in use`
    )
  }
}