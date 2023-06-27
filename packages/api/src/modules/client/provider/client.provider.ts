import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateClientDTO,
  UpdateClientDTO,
  UpsertClientDTO,
} from '../dtos/client.in.dto';

@Injectable()
export class ClientProvider {
  constructor(private prismaService: PrismaService) { }

  async createClient(data: CreateClientDTO) {
    return await this.prismaService.client.client.create({
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
      },
    });
  }

  async listClients() {
    return await this.prismaService.client.client.findMany({
      where: { deleted: false },
    });
  }

  async getClient(id: number) {
    return await this.prismaService.client.client.findFirst({
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
      },
    });
  }

  async updateClient({ id, ...data }: UpdateClientDTO) {
    return await this.prismaService.client.client.update({
      data,
      where: { id },
    });
  }

  async upsertClient({ id, ...data }: UpsertClientDTO) {
    return await this.prismaService.client.client.upsert({
      where: id != null ? { id } : { id: -1 },
      create: data,
      update: id != null ? { id, ...data } : {},
    });
  }

  async deleteClient(id: number) {
    return await this.prismaService.client.client.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
