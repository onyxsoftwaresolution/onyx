import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpsertProjectDTO } from '../dtos/project.in.dto';

@Injectable()
export class ProjectProvider {
  constructor(private prismaService: PrismaService) { }

  async upsertProject({ id, area, areaAdmin, code, description, end, localAdmin, projectActivities, start }: UpsertProjectDTO): ReturnType<ProjectProvider["getProject"]> {
    const currentProjectActivities = await this.prismaService.client.projectActivity.findMany({
      where: { projectId: id }
    });

    const remainingProjectActivityIds = projectActivities.filter(pa => pa.id != null).map(pa => pa.id);
    const deleteProjectActivityIds = currentProjectActivities.map(pa => pa.id).filter(id => !remainingProjectActivityIds.includes(id));
    const createProjectActivities = projectActivities.filter(pa => pa.id == null);
    const updateProjectActivities = projectActivities.filter(pa => pa.id != null);

    await this.prismaService.client.project.upsert({
      where: { id: id ?? -1 },
      create: {
        area, code, description, end, start, areaAdminId: areaAdmin.id, localAdminId: localAdmin.id,
        projectActivities: {
          createMany: {
            data: createProjectActivities.map(({ description, cost, material, quantity }) => ({ description, cost, material, quantity })),
          },
        }
      },
      update: {
        id, area, code, description, end, start, areaAdminId: areaAdmin.id, localAdminId: localAdmin.id,
        projectActivities: {
          createMany: {
            data: createProjectActivities.map(({ description, cost, material, quantity }) => ({ description, cost, material, quantity })),
          },
          updateMany: [
            {
              where: {
                OR: deleteProjectActivityIds.map(id => ({ id })),
              },
              data: {
                deleted: true,
              },
            },
          ],
          update: updateProjectActivities.map(({ id, description, cost, material, quantity }) => ({
            where: { id },
            data: { description, cost, material, quantity },
          })),
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
      where: {
        id,
        deleted: false,
        available: true,
        areaAdmin: { deleted: false },
        localAdmin: { deleted: false },
        projectActivities: { every: { deleted: false } }
      },
      select: {
        id: true,
        area: true,
        areaAdmin: {
          select: {
            id: true,
            name: true,
            position: true,
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
            name: true,
            position: true,
          }
        },
        localAdminId: true,
        projectActivities: {
          select: {
            id: true,
            cost: true,
            description: true,
            material: true,
            quantity: true,
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
