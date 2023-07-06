import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  UpsertReceiptDTO,
} from './dtos/receipt.in.dto';

@Injectable()
export class ReceiptProvider {
  constructor(private prismaService: PrismaService) { }

  async listReceipts() {
    return await this.prismaService.client.receipt.findMany({
      where: { deleted: false },
    });
  }

  async getReceipt(id: number) {
    return await this.prismaService.client.receipt.findFirst({
      where: {
        id,
        deleted: false,
      },
    });
  }

  async upsertReceipt({ id, ...data }: UpsertReceiptDTO) {
    return await this.prismaService.client.receipt.upsert({
      where: id != null ? { id } : { id: -1 },
      create: {
        ...data,
        contract: {},
      },
      update: id != null ? { id, ...data } : {},
    });
  }

  async deleteReceipt(id: number) {
    return await this.prismaService.client.receipt.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
