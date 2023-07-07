import { Injectable } from '@nestjs/common';
import {
  UpsertSupplierDTO,
} from './dtos/supplier.in.dto';
import { SupplierOutDTO } from './dtos/supplier.out.dto';
import { SupplierProvider } from './supplier.provider';
import { ProductOutDTO } from '@modules/product/dtos/product.out.dto';

@Injectable()
export class SupplierService {
  constructor(private supplierProvider: SupplierProvider) { }

  async listSuppliers() {
    const suppliers = await this.supplierProvider.listSuppliers();
    return suppliers.map((e) => new SupplierOutDTO(e));
  }

  async listSupplierProducts(id: number) {
    const products = await this.supplierProvider.listSupplierProducts(id);
    return products.map((e) => new ProductOutDTO(e));
  }

  async getSupplier(id: number): Promise<SupplierOutDTO> {
    return new SupplierOutDTO(await this.supplierProvider.getSupplier(id));
  }

  async upsertSupplier(data: UpsertSupplierDTO) {
    return new SupplierOutDTO(await this.supplierProvider.upsertSupplier(data));
  }

  async deleteSupplier(id: number) {
    return new SupplierOutDTO(await this.supplierProvider.deleteSupplier(id));
  }
}
