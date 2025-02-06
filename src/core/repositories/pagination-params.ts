import { ProductStatus } from "@/domain/marketplace/enterprise/entities/product"

export interface PaginationParams {
  page: number
}

export interface PaginationProductsParams {
  page: number
  status?: ProductStatus
  search?: string
  sellerId?: string
}
