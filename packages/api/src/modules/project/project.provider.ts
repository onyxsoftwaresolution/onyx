import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpsertProjectDTO } from './dtos/project.in.dto';

@Injectable()
export class ProjectProvider {
  constructor(private prismaService: PrismaService) { }

  async upsertProject({ id, area, areaAdmin, code, description, end, localAdmin, projectActivities, start, contract }: UpsertProjectDTO): ReturnType<ProjectProvider["getProject"]> {
    const currentProject = await this.getProject(id);

    const currentProjectActivities = currentProject.projectActivities;
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
            data: createProjectActivities.map(({ description, cost, quantity, activityTemplateId }) => ({ description, cost, quantity, activityTemplateId })),
          },
        }
      },
      update: {
        id, area, code, description, end, start, areaAdminId: areaAdmin.id, localAdminId: localAdmin.id,
        contractId: contract.id,
        projectActivities: {
          createMany: {
            data: createProjectActivities.map(({ description, cost, quantity, activityTemplateId }) => ({ description, cost, quantity, activityTemplateId })),
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
          update: updateProjectActivities.map(({ id, description, cost, quantity }) => ({
            where: { id },
            data: { description, cost, quantity },
          })),
        },
      }
    });

    return await this.getProject(id);
  }

  async listProjects() {
    return await this.prismaService.client.project.findMany({
      where: { deleted: false, available: true },
      orderBy: { modified: 'desc' },
    });
  }

  async getProject(id: number) {
    return await this.prismaService.client.project.findFirst({
      where: {
        id,
        deleted: false,
        available: true,
      },
      select: {
        id: true,
        area: true,
        areaAdmin: true,
        areaAdminId: true,
        available: true,
        code: true,
        description: true,
        start: true,
        end: true,
        localAdmin: true,
        localAdminId: true,
        projectActivities: {
          where: { deleted: false },
        },
        contractId: true,
        contract: {
          include: { client: true, }
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
