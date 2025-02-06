import { ProductRepository } from "@/domain/marketplace/application/repositories/product-repository";
import { CountByProduct, CountBySeller, ViewRepository, ViewsPerDay } from "@/domain/marketplace/application/repositories/view-repository";
import { View } from "@/domain/marketplace/enterprise/entities/view";

export class InMemoryViewRepository extends ViewRepository {
  public items: View[] = [];

  constructor(
    private productRepository: ProductRepository
  ) {
    super()
  }
  async create(view: View): Promise<void> {
    this.items.push(view);
  }
  async findByViewerId(viewerId: string, productId: string): Promise<View | null> {
    const view = this.items.find((item) => item.viewerId.toString() === viewerId && item.productId.toString() === productId);

    if (!view) {
      return null;
    }

    return view;
  }

  async findManyByProductId(productId: string): Promise<View[]> {
    const view = this.items
      .filter((item) => item.productId.toString() === productId)

    return view
  }

  async countBySeller({ from, sellerId }: CountBySeller): Promise<number> {
    const productIdsSeller = await this.productRepository.findAllBySellerId(sellerId);

    const amount = this.items.filter((item) => {
      const matchProductId = productIdsSeller.some(product => product.id.toString() === item.productId.toString());
      const matchesDate = from ? new Date(item.createdAt) >= new Date(from) : true;

      return matchesDate && matchProductId;
    }).length;

    return amount;
  }

  async countPerDay({ sellerId, from }: CountBySeller): Promise<ViewsPerDay[]> {
    const productIdsSeller = await this.productRepository.findAllBySellerId(sellerId);
    const productIds = productIdsSeller.map((product) => product.id.toString())

    const viewsPerDayMap = new Map<string, number>();

    this.items.forEach((item) => {
      const itemProductId = item.productId.toString();
      const matchProductId = productIds.includes(itemProductId);

      const itemDate = new Date(item.createdAt);
      const matchesDate = from ? itemDate >= new Date(from) : true;
      const formattedDate = itemDate.toISOString().split("T")[0]; // YYYY-MM-DD

      if (matchProductId && matchesDate) {
        viewsPerDayMap.set(formattedDate, (viewsPerDayMap.get(formattedDate) || 0) + 1);
      }
    });

    return Array.from(viewsPerDayMap.entries()).map(([date, amount]) => ({
      date: new Date(date),
      amount,
    }));
  }

  async countByProduct({ from, productId }: CountByProduct): Promise<number> {
    const amount = this.items.filter((item) => {
      const matchProductId = item.productId.toString() === productId;
      const matchesDate = from ? new Date(item.createdAt) >= new Date(from) : true;

      return matchesDate && matchProductId;
    }).length;

    return amount;
  }

}