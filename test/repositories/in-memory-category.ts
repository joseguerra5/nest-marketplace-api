import { CategoryRepository } from "@/domain/marketplace/application/repositories/category-repository";
import { Category } from "@/domain/marketplace/enterprise/entities/category";

export class InMemoryCategoryRepository implements CategoryRepository {

  public items: Category[] = [];

  async save(category: Category): Promise<void> {
    this.items.push(category);
  }

  async findById(id: string): Promise<Category | null> {
    const category = this.items.find((item) => item.id.toString() === id);
    if (!category) {
      return null;
    }

    return category;
  }

  async findAll(): Promise<Category[]> {
    const category = this.items
    return category
  }

  async create(attach: Category): Promise<void> {
    this.items.push(attach)
  }
}