import { Injectable } from '@nestjs/common';
import {
  CreateSupplierDTO,
  UpdateSupplierDTO,
  UpsertSupplierDTO,
} from '../dtos/supplier.in.dto';
import { SupplierOutDTO } from '../dtos/supplier.out.dto';
import { SupplierProvider } from '../provider/supplier.provider';

@Injectable()
export class SupplierService {
  constructor(private supplierProvider: SupplierProvider) { }

  async createSupplier(data: CreateSupplierDTO) {
    return new SupplierOutDTO(await this.supplierProvider.createSupplier(data));
  }

  async listSuppliers() {
    const suppliers = await this.supplierProvider.listSuppliers();
    return suppliers.map((e) => new SupplierOutDTO(e));
  }

  async getSupplier(id: number): Promise<SupplierOutDTO> {
    return new SupplierOutDTO(await this.supplierProvider.getSupplier(id));
  }

  async updateSupplier(data: UpdateSupplierDTO) {
    return new SupplierOutDTO(await this.supplierProvider.updateSupplier(data));
  }

  async upsertSupplier(data: UpsertSupplierDTO) {
    return new SupplierOutDTO(await this.supplierProvider.upsertSupplier(data));
  }

  async deleteSupplier(id: number) {
    return new SupplierOutDTO(await this.supplierProvider.deleteSupplier(id));
  }
}
