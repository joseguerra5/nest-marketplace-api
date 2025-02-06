import { View } from "../../enterprise/entities/view";

export interface CountBySeller {
  sellerId: string
  from: Date
}

export interface CountByProduct {
  productId: string
  from: Date
}

export interface ViewsPerDay {
  date: Date
  amount: number
}

export abstract class ViewRepository {
  abstract create(view: View): Promise<void>
  abstract findByViewerId(viewerId: string, productId: string): Promise<View | null>
  abstract findManyByProductId(productId: string): Promise<View[]>
  abstract countBySeller(params: CountBySeller): Promise<number>
  abstract countPerDay(params: CountBySeller): Promise<ViewsPerDay[]>
  abstract countByProduct(params: CountByProduct): Promise<number>
}