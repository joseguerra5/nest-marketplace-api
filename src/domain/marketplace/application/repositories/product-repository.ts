import { PaginationParams, PaginationProductsParams } from "@/core/repositories/pagination-params";
import { Product } from "../../enterprise/entities/product";

export interface Count {
  sellerId: string
  from?: Date
  status?: Product['status']
}
export abstract class ProductRepository {
  abstract create(product: Product): Promise<void>
  abstract save(product: Product): Promise<void>
  abstract findById(id: string): Promise<Product | null>
  abstract findManyBySellerId(
    sellerId: string,
    params: PaginationParams
  ): Promise<Product[]>
  abstract findAllBySellerId(
    sellerId: string,
  ): Promise<Product[]>
  abstract count(
    params: Count,
  ): Promise<number>
  abstract findMany(
    params: PaginationParams
  ): Promise<Product[]>
  abstract findManyWithParams(
    params: PaginationProductsParams
  ): Promise<Product[]>
}