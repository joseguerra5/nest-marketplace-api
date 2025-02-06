import { UseCaseError } from "@/core/error/use-case-error";

export class PasswordsDoNotMatch extends Error implements UseCaseError {
  constructor() {
    super(`passwords do not match`)
  }
}
