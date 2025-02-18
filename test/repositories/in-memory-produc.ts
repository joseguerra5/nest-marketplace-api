import { PaginationParams, PaginationProductsParams } from "@/core/repositories/pagination-params";
import { Count, ProductRepository } from "@/domain/marketplace/application/repositories/product-repository";
import { Product } from "@/domain/marketplace/enterprise/entities/product";
import { ProductWithDetails } from "@/domain/marketplace/enterprise/entities/value-objects/product-with-details";
import { Seller } from "@/domain/marketplace/enterprise/entities/seller";
import { Category } from "@/domain/marketplace/enterprise/entities/category";
import { ProductAttachmentsRepository } from "@/domain/marketplace/application/repositories/product-attachment-repository";
import { CategoryRepository } from "@/domain/marketplace/application/repositories/category-repository";
import { SellerRepository } from "@/domain/marketplace/application/repositories/seller-repository";

export class InMemoryProductRepository implements ProductRepository {
  constructor(
    private inMemorySellerRepository: SellerRepository,
    private inMemoryCategoryRepository: CategoryRepository,
    private inMemoryProductAttachmentRepository: ProductAttachmentsRepository
  ) { }
  

  public items: Product[] = [];

  async findManyWithParamsAndDetails({page, search, sellerId, status}: PaginationProductsParams): Promise<ProductWithDetails[]> {
    let filteredItems = this.items;

    if (sellerId) {
        filteredItems = filteredItems.filter(item => item.sellerId.toString() === sellerId);
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

    // Ordenação por data de criação antes da paginação
    filteredItems = filteredItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Paginação
    const startIndex = (page - 1) * 20;
    const endIndex = page * 20;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return paginatedItems.map(product => {
        const seller = this.inMemorySellerRepository.findById(product.sellerId.toString())
        if (!seller) {
            throw new Error("Seller not found");
        }

        const category = this.inMemoryCategoryRepository.findById(product.categoryId)
        
        if (!category) {
            throw new Error(`Category not found for product: ${product.id}`);
        }

        return ProductWithDetails.create({
            productId: product.id,
            createdAt: product.createdAt,
            title: product.title,
            description: product.description,
            priceInCents: product.priceInCents,
            status: product.status,
            owner: Seller.create(seller),
            category,
        });
    });
  }

  async findByIdWithDetails(id: string): Promise<ProductWithDetails | null> {
    const product = this.items
      .find((item) => item.id.toString() === id)

    if (!product) {
      return null;
    }

    const seller = this.inMemorySellerRepository.findById(product.sellerId)

    if (!seller) {
      throw new Error('Seller not found')
    }

    const category = this.inMemoryCategoryRepository.findById(product.categoryId)


    if (!category) {
      throw new Error('Category not found')
    }


    return ProductWithDetails.create({
      productId: product.id,
      title: product.title,
      createdAt: product.createdAt,
      description: product.description,
      priceInCents: product.priceInCents,
      status: product.status,
      owner: Seller.create(seller),
      category: Category.create(category)
    })
  }

  async save(product: Product): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(product.id));

    this.items[itemIndex] = product;

    await this.inMemoryProductAttachmentRepository.createMany(
      product.attachments.getNewItems(),
    )

    await this.inMemoryProductAttachmentRepository.deleteMany(
      product.attachments.getRemovedItems(),
    )
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

  async create(product: Product): Promise<void> {
    this.items.push(product)

    await this.inMemoryProductAttachmentRepository.createMany(
      product.attachments.getItems(),
    )
  }
}