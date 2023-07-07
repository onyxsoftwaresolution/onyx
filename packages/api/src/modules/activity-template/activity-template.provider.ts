import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  UpsertActivityTemplateDTO,
} from './dtos/activity-template-in.dto';

@Injectable()
export class ActivityTemplateProvider {
  constructor(private prismaService: PrismaService) { }

  async listActivityTemplates() {
    return await this.prismaService.client.activityTemplate.findMany({
      where: { deleted: false, available: true },
      include: {
        supplier: true,
        product: true,
      }
    });
  }

  async getActivityTemplate(id: number) {
    return await this.prismaService.client.activityTemplate.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
        supplier: true,
        product: true,
      }
    });
  }

  async upsertActivityTemplate({ id, description, cost, product, supplier }: UpsertActivityTemplateDTO) {
    return await this.prismaService.client.activityTemplate.upsert({
      where: id != null ? { id } : { id: -1 },
      create: {
        description,
        cost,
        projectActivities: {},
        supplier: supplier?.id != null ? { connect: { id: supplier.id } } : {},
        product: supplier?.id != null && product?.id != null ? { connect: { id: product.id } } : {},
      },
      update: {
        description,
        cost,
        projectActivities: {},
        supplier: supplier?.id != null ? { connect: { id: supplier.id } } : {},
        product: supplier?.id != null && product?.id != null ? { connect: { id: product.id } } : {},
      },
    });
  }

  async deleteActivityTemplate(id: number) {
    return await this.prismaService.client.activityTemplate.update({
      where: { id },
      data: { deleted: true },
    });
  }

}
