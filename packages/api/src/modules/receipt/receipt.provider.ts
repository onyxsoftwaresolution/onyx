import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  UpsertReceiptDTO,
} from './dtos/receipt.in.dto';

@Injectable()
export class ReceiptProvider {
  constructor(private prismaService: PrismaService) { }

  async listProjectReceipts(projectId: number) {
    return await this.prismaService.client.receipt.findMany({
      where: {
        deleted: false,
        invoice: {
          projectId,
        },
      },
      include: {
        invoice: true,
      },
    });
  }

  async getReceipt(id: number) {
    return await this.prismaService.client.receipt.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
        invoice: true,
      },
    });
  }

  async upsertReceipt({ id, amount, date, invoice, type }: UpsertReceiptDTO) {
    return await this.prismaService.client.receipt.upsert({
      where: id != null ? { id } : { id: -1 },
      create: { amount, date, type, invoiceId: invoice.id },
      update: id != null ? { id, amount, date, invoiceId: invoice.id, type } : {},
    });
  }

  async deleteReceipt(id: number) {
    return await this.prismaService.client.receipt.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
