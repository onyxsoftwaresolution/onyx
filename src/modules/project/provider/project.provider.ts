import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateProject } from '../dtos/project.in.dto';

@Injectable()
export class ProjectProvider {
  constructor(private prismaService: PrismaService) {}

  async createProject(createProject: CreateProject) {
    return await this.prismaService.client.project.create({
      data: createProject,
      select: {
        id: true,
        created: true,
        modified: true,
        code: true,
        description: true,
        area: true,
        start: true,
        end: true,
      },
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
}
