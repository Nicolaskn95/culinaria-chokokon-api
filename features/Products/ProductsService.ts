import { Product } from "../../models/Product.ts";
import { ProductRepository } from "../../repositories/ProductRepository.ts";
import { IProduct } from "../../interfaces/product/IProduct.ts";

export class ProductsService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async create(data: Partial<IProduct>): Promise<Product> {
    const product = new Product(data as IProduct);
    const created = await this.productRepository.create(product);
    return created[0];
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.findMany({}).exec();
    return products;
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.productRepository.findById(id).exec();
    return product;
  }

  async update(id: string, data: Partial<IProduct>): Promise<Product | null> {
    const product = await this.productRepository
      .findByIdAndUpdate(id, data)
      .exec();
    return product;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.productRepository.deleteOne({ _id: id });
    return deleted !== null;
  }
}
