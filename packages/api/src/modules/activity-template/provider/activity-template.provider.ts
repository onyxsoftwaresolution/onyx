import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateActivityTemplateDTO,
  UpsertActivityTemplateDTO,
} from '../dtos/activity-template-in.dto';

@Injectable()
export class ActivityTemplateProvider {
  constructor(private prisma: PrismaService) {}

  async createActivityTemplates(activity: CreateActivityTemplateDTO) {
    return await this.prisma.client.activityTemplate.create({
      data: activity,
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
    return await this.prisma.client.activityTemplate.upsert({
      where: id != null ? { id } : { id: -1 },
      create: data,
      update: id != null ? { id, ...data } : {},
    });
  }

  async listActivityTemplates() {
    return await this.prisma.client.activityTemplate.findMany({
      where: { deleted: false, available: true },
    });
  }
}
