import { PaginationParams, PaginationProductsParams } from "@/core/repositories/pagination-params";
import { Count, ProductRepository } from "@/domain/marketplace/application/repositories/product-repository";
import { Product } from "@/domain/marketplace/enterprise/entities/product";

export class InMemoryProductRepository implements ProductRepository {
  public items: Product[] = [];

  async save(product: Product): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(product.id));

    this.items[itemIndex] = product;
  }
  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) {
      return null;
    }

    return product;
  }

  async count({ sellerId, from, status }: Count): Promise<number> {
    const amount = this.items.filter((item) => {
      const matchSeller = item.sellerId.toString() === sellerId
      const matchesStatus = status ? item.status === status : true
      const matchesDate = from ? new Date(item.createdAt) >= new Date(from) : true
      return matchSeller && matchesDate && matchesStatus
    }).length

    return amount
  }

  async findMany({ page }: PaginationParams): Promise<Product[]> {
    const Product = this.items
      .slice((page - 1) * 20, page * 20)

    return Product
  }

  async findManyWithParams({ page, search, status, sellerId }: PaginationProductsParams): Promise<Product[]> {
    let filteredItems = this.items;

    if (sellerId) {
      filteredItems = filteredItems.filter(item =>
        item.sellerId.toString() === sellerId
      );
    }

    if (search) {
      filteredItems = filteredItems.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filteredItems = filteredItems.filter(item => item.status === status);
    }

    const startIndex = (page - 1) * 20;
    const endIndex = page * 20;
    return filteredItems
      .sort((a, b) => b.createdAt
        .getTime() - a.createdAt.getTime())
      .slice(startIndex, endIndex);
  }

  async findManyBySellerId(sellerId: string,
    { page }: PaginationParams
  ): Promise<Product[]> {
    const Product = this.items
      .filter((item) => item.sellerId.toString() === sellerId)
      .slice((page - 1) * 20, page * 20)

    return Product
  }

  async findAllBySellerId(sellerId: string): Promise<Product[]> {
    const Product = this.items
      .filter((item) => item.sellerId.toString() === sellerId)


    return Product
  }

  async create(attach: Product): Promise<void> {
    this.items.push(attach)
  }
}