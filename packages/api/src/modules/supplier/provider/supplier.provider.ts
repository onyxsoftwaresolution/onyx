import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateSupplierDTO,
  UpdateSupplierDTO,
  UpsertSupplierDTO,
} from '../dtos/supplier.in.dto';

@Injectable()
export class SupplierProvider {
  constructor(private prismaService: PrismaService) { }

  async createSupplier(data: CreateSupplierDTO) {
    return await this.prismaService.client.supplier.create({
      data,
      select: {
        id: true,
        name: true,
        address: true,
        bankName: true,
        bankIban: true,
        cif: true,
        email: true,
        phoneNumber: true,
        rc: true,
        products: true,
      },
    });
  }

  async listSuppliers() {
    return await this.prismaService.client.supplier.findMany({
      where: { deleted: false },
    });
  }

  async getSupplier(id: number) {
    return await this.prismaService.client.supplier.findFirst({
      where: {
        id,
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        address: true,
        cif: true,
        rc: true,
        bankName: true,
        bankIban: true,
        email: true,
        phoneNumber: true,
        products: true,
      },
    });
  }

  async updateSupplier({ id, ...data }: UpdateSupplierDTO) {
    return await this.prismaService.client.supplier.update({
      data,
      where: { id },
    });
  }

  async upsertSupplier({ id, ...data }: UpsertSupplierDTO) {
    return await this.prismaService.client.supplier.upsert({
      where: id != null ? { id } : { id: -1 },
      create: data,
      update: id != null ? { id, ...data } : {},
    });
  }

  async deleteSupplier(id: number) {
    return await this.prismaService.client.supplier.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
