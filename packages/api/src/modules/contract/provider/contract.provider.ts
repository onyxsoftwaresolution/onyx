import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpsertContractDTO } from '../dtos/contract.in.dto';

@Injectable()
export class ContractProvider {
  constructor(private prismaService: PrismaService) { }

  async upsertContract({ id, end, start, client, cost, details, location, number, representative }: UpsertContractDTO): ReturnType<ContractProvider["getContract"]> {
    await this.prismaService.client.contract.upsert({
      where: { id: id ?? -1 },
      create: {
        end, start, clientId: client.id, cost, details, location, number, representative,
      },
      update: {
        end, start, clientId: client.id, cost, details, location, number, representative,
      }
    });

    return await this.getContract(id);
  }

  async listContracts() {
    return await this.prismaService.client.contract.findMany({
      where: { deleted: false },
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
        client: {
          select: {
            id: true,
            address: true,
            bankIban: true,
            bankName: true,
            cif: true,
            email: true,
            name: true,
            phoneNumber: true,
            rc: true,
          }
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
