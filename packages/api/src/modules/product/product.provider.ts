import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  UpsertProductDTO,
} from './dtos/product.in.dto';

@Injectable()
export class ProductProvider {
  constructor(private prismaService: PrismaService) { }

  async listProducts() {
    return await this.prismaService.client.product.findMany({
      where: { deleted: false },
      include: { suppliers: true }
    });
  }

  async getProduct(id: number) {
    return await this.prismaService.client.product.findFirst({
      where: {
        id,
        deleted: false,
      },
    });
  }

  async upsertProduct({ id, ...data }: UpsertProductDTO) {
    return await this.prismaService.client.product.upsert({
      where: id != null ? { id } : { id: -1 },
      create: data,
      update: id != null ? { id, ...data } : {},
    });
  }

  async deleteProduct(id: number) {
    return await this.prismaService.client.product.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
