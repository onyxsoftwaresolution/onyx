import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpsertContractDTO } from './dtos/contract.in.dto';
import { Entity, getEntityConnections } from '@common/EntityConnections';

@Injectable()
export class ContractProvider {
  constructor(private prismaService: PrismaService) { }

  async upsertContract({ id, end, start, client, cost, details, location, number, representative, suppliers }: UpsertContractDTO): ReturnType<ContractProvider["getContract"]> {
    const currentContract = await this.getContract(id);

    const {
      connect: supplierConnect,
      disconnect: supplierDisconnect
    } = getEntityConnections((currentContract?.suppliers ?? []) as unknown as Entity[], suppliers as unknown as Entity[]);

    await this.prismaService.client.contract.upsert({
      where: { id: id ?? -1 },
      create: {
        end, start, clientId: client.id, cost, details, location, number, representative,
        suppliers: {
          connect: supplierConnect,
        },
      },
      update: {
        end, start, clientId: client.id, cost, details, location, number, representative,
        suppliers: {
          connect: supplierConnect,
          disconnect: supplierDisconnect,
        },
      }
    });

    return await this.getContract(id);
  }

  async listContracts() {
    return await this.prismaService.client.contract.findMany({
      where: { deleted: false },
      include: { client: true },
      orderBy: { modified: 'desc' },
    });
  }

  async getContract(id: number) {
    return await this.prismaService.client.contract.findFirst({
      where: {
        id,
        deleted: false,
      },
      select: {
        id: true,
        client: true,
        suppliers: {
          where: { deleted: false },
        },
        clientId: true,
        cost: true,
        details: true,
        location: true,
        number: true,
        representative: true,
        start: true,
        end: true,
      },
    });
  }

  async deleteContract(id: number) {
    return await this.prismaService.client.contract.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
