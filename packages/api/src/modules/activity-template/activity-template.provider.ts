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
      }
    });
  }

  async upsertActivityTemplate({ id, ...data }: UpsertActivityTemplateDTO) {
    return await this.prismaService.client.activityTemplate.upsert({
      where: id != null ? { id } : { id: -1 },
      create: {
        ...data,
        projectActivities: {},
        supplier: {},
        product: {},
      },
      update: { id, ...data },
    });
  }

  async deleteActivityTemplate(id: number) {
    return await this.prismaService.client.activityTemplate.update({
      where: { id },
      data: { deleted: true },
    });
  }

}
