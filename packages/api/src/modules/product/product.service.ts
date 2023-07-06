import { Injectable } from '@nestjs/common';
import {
  UpsertProductDTO,
} from './dtos/product.in.dto';
import { ProductOutDTO } from './dtos/product.out.dto';
import { ProductProvider } from './product.provider';

@Injectable()
export class ProductService {
  constructor(private productProvider: ProductProvider) { }

  async listProducts() {
    const products = await this.productProvider.listProducts();
    return products.map((e) => new ProductOutDTO(e));
  }

  async getProduct(id: number): Promise<ProductOutDTO> {
    return new ProductOutDTO(await this.productProvider.getProduct(id));
  }

  async upsertProduct(data: UpsertProductDTO) {
    return new ProductOutDTO(await this.productProvider.upsertProduct(data));
  }

  async deleteProduct(id: number) {
    return new ProductOutDTO(await this.productProvider.deleteProduct(id));
  }
}
