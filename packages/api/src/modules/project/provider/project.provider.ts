import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpsertProjectDTO } from '../dtos/project.in.dto';

@Injectable()
export class ProjectProvider {
  constructor(private prismaService: PrismaService) {}

  async upsertProject(data: UpsertProjectDTO) {
    return await this.prismaService.client.project.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async listProjects() {
    return await this.prismaService.client.project.findMany({
      where: { deleted: false, available: true },
    });
  }

  async getProject(id: number) {
    return await this.prismaService.client.project.findFirst({
      where: { id, deleted: false, available: true },
      select: {
        id: true,
        area: true,
        areaAdmin: { select: { id: true } },
        areaAdminId: true,
        available: true,
        code: true,
        description: true,
        start: true,
        end: true,
        localAdmin: { select: { id: true } },
        localAdminId: true,
        projectActivities: { select: { id: true } },
      },
    });
  }

  async deleteProject(id: number) {
    return await this.prismaService.client.project.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
