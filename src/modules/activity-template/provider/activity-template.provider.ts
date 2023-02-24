import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateActivityTemplateDTO } from '../dtos/activity-template-in.dto';

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

  async listActivityTemplates() {
    return await this.prisma.client.activityTemplate.findMany({
      select: {
        id: true,
        available: true,
        cost: true,
        description: true,
        material: true,
      },
    });
  }
}
