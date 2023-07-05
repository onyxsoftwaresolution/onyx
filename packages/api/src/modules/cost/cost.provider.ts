import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  UpsertCostDTO,
} from './dtos/cost.in.dto';

@Injectable()
export class CostProvider {
  constructor(private prismaService: PrismaService) { }

  async listCosts() {
    return await this.prismaService.client.cost.findMany({
      where: { deleted: false },
    });
  }

  async getCost(id: number) {
    return await this.prismaService.client.cost.findFirst({
      where: {
        id,
        deleted: false,
      },
    });
  }

  async upsertCost({ id, ...data }: UpsertCostDTO) {
    return await this.prismaService.client.cost.upsert({
      where: id != null ? { id } : { id: -1 },
      // @ts-expect-error 123
      create: data,
      // @ts-expect-error 123
      update: id != null ? { id, ...data } : {},
    });
  }

  async deleteCost(id: number) {
    return await this.prismaService.client.cost.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
