import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ProductStatus } from "@prisma/client";

export class ProductStatusValidationPipe implements PipeTransform {
  transform(value: string) {
      const validStatus = ProductStatus[value.toUpperCase() as keyof typeof ProductStatus]

      if (!validStatus) {
        throw new BadRequestException()
      }

      return validStatus
  }
}