import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateActivityTemplateDTO,
  UpsertActivityTemplateDTO,
} from '../dtos/activity-template-in.dto';

@Injectable()
export class ActivityTemplateProvider {
  constructor(private prismaService: PrismaService) { }

  async createActivityTemplates(activity: CreateActivityTemplateDTO) {
    return await this.prismaService.client.activityTemplate.create({
      data: {
        ...activity,
        supplier: {},
        product: {},
      },
      select: {
        id: true,
        description: true,
        material: true,
        available: true,
        cost: true,
        created: true,
        modified: true,
        deleted: true,
      },
    });
  }

  async upsertActivityTemplates({ id, ...data }: UpsertActivityTemplateDTO) {
    return await this.prismaService.client.activityTemplate.upsert({
      where: id != null ? { id } : { id: -1 },
      create: {
        ...data,
        projectActivities: {},
        supplier: {},
        product: {},
      },
      update: id != null ? { id, ...data } : {},
    });
  }

  async deleteActivityTemplates(id: number) {
    return await this.prismaService.client.activityTemplate.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async listActivityTemplates() {
    return await this.prismaService.client.activityTemplate.findMany({
      where: { deleted: false, available: true },
    });
  }
}
