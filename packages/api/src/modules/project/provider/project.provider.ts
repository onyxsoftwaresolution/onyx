import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { Project } from '@prisma/client';
import { UpsertProjectDTO } from '../dtos/project.in.dto';

@Injectable()
export class ProjectProvider {
  constructor(private prismaService: PrismaService) { }

  async upsertProject({ id, area, areaAdmin, code, description, end, localAdmin, projectActivities, start }: UpsertProjectDTO): ReturnType<ProjectProvider["getProject"]> {
    debugger

    const currentProjectActivities = await this.prismaService.client.projectActivity.findMany({
      where: { projectId: id }
    });

    const remainingProjectActivityIds = projectActivities.filter(pa => pa.id != null).map(pa => pa.id);
    const deleteProjectActivityIds = currentProjectActivities.map(pa => pa.id).filter(id => !remainingProjectActivityIds.includes(id));

    await this.prismaService.client.project.upsert({
      where: { id },
      create: {
        area, code, description, end, start, areaAdminId: areaAdmin.id, localAdminId: localAdmin.id,
      },
      update: {
        id, area, code, description, end, start, areaAdminId: areaAdmin.id, localAdminId: localAdmin.id,
        projectActivities: {
          createMany: {
            data: projectActivities
              .filter(pa => pa.id == null)
              .map(({ description, cost, material, total }) => ({ description, cost, material, total })),
          },
          deleteMany: {
            OR: deleteProjectActivityIds.map(id => ({ id })),
          }
        }
      }
    });

    return await this.getProject(id);
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
        areaAdmin: {
          select: {
            id: true,
            name: true
          }
        },
        areaAdminId: true,
        available: true,
        code: true,
        description: true,
        start: true,
        end: true,
        localAdmin: {
          select: {
            id: true,
            name: true
          }
        },
        localAdminId: true,
        projectActivities: {
          select: {
            id: true,
            cost: true,
            description: true,
            material: true,
            total: true,
          }
        },
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
