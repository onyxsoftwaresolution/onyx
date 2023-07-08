import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpsertContractDTO } from './dtos/contract.in.dto';

@Injectable()
export class ContractProvider {
  constructor(private prismaService: PrismaService) { }

  async upsertContract({ id, end, start, client, cost, details, location, number, representative }: UpsertContractDTO): ReturnType<ContractProvider["getContract"]> {
    return await this.prismaService.client.contract.upsert({
      where: { id: id ?? -1 },
      create: {
        end, start, cost, details, location, number, representative,
        client: {
          connect: { id: client.id }
        }
      },
      update: {
        end, start, cost, details, location, number, representative,
        client: {
          connect: { id: client.id }
        }
      },
      include: {
        client: true,
      }
    });
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
      include: {
        client: true,
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
