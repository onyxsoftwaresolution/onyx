import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  UpdateSupplierDTO,
  UpsertSupplierDTO,
} from './dtos/supplier.in.dto';

@Injectable()
export class SupplierProvider {
  constructor(private prismaService: PrismaService) { }

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