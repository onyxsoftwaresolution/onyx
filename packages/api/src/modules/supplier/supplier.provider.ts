import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  UpsertSupplierDTO,
} from './dtos/supplier.in.dto';
import { Entity, getEntityConnections } from '@common/EntityConnections';

@Injectable()
export class SupplierProvider {
  constructor(private prismaService: PrismaService) { }

  async listSuppliers() {
    return await this.prismaService.client.supplier.findMany({
      where: { deleted: false },
      include: {
        products: true,
      },
    });
  }

  async listSupplierProducts(id: number) {
    const supplier = await this.getSupplier(id);
    return supplier.products;
  }

  async getSupplier(id: number) {
    return await this.prismaService.client.supplier.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
        products: true,
      },
    });
  }

  async upsertSupplier({ id, ...data }: UpsertSupplierDTO) {
    const currentSupplier = await this.getSupplier(id);

    const {
      connect: productConnect,
      disconnect: productDisconnect
    } = getEntityConnections((currentSupplier?.products ?? []) as unknown as Entity[], data.products as unknown as Entity[]);

    return await this.prismaService.client.supplier.upsert({
      where: id != null ? { id } : { id: -1 },
      create: {
        ...data,
        products: {
          connect: productConnect.map(p => ({ id: p.id })),
        }
      },
      update: {
        id,
        ...data,
        products: {
          connect: productConnect.map(p => ({ id: p.id })),
          disconnect: productDisconnect.map(p => ({ id: p.id })),
        },
      },
    });
  }

  async deleteSupplier(id: number) {
    return await this.prismaService.client.supplier.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
