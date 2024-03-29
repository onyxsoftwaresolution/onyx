import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpsertProjectDTO } from './dtos/project.in.dto';
import { ProjectActivityQueryParams, ProjectQueryParams } from './dtos/project.out.dto';
import { QueryPaths } from '@common/QueryParams';

@Injectable()
export class ProjectProvider {
  constructor(private prismaService: PrismaService) { }

  async upsertProject({ id, area, areaAdmin, code, description, end, localAdmin, projectActivities, start, contract }: UpsertProjectDTO): ReturnType<ProjectProvider["getProject"]> {
    const currentProject = await this.getProject(id);

    const currentProjectActivities = currentProject?.projectActivities ?? [];
    const remainingProjectActivityIds = projectActivities.filter(pa => pa.id != null).map(pa => pa.id);
    const deleteProjectActivityIds = currentProjectActivities.map(pa => pa.id).filter(id => !remainingProjectActivityIds.includes(id));
    const createProjectActivities = projectActivities.filter(pa => pa.id == null);
    const updateProjectActivities = projectActivities.filter(pa => pa.id != null);

    await this.prismaService.client.project.upsert({
      where: { id: id ?? -1 },
      create: {
        area, code, description, end, start, areaAdminId: areaAdmin.id, localAdminId: localAdmin.id,
        contractId: contract.id,
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

  async listProjects(params: ProjectQueryParams, paths: QueryPaths) {
    return await this.prismaService.client.project.findMany({
      where: { deleted: false, available: params.available },
      orderBy: { modified: 'desc' },
      include: {
        areaAdmin: paths.has('areaAdmin'),
        localAdmin: paths.has('localAdmin'),
        contract: paths.has('contract'),
        projectActivities: paths.has('projectActivities') ? {
          include: {
            activityTemplate: paths.has('projectActivities.activityTemplate'),
            costs: paths.has('projectActivities.costs') ? {
              where: { deleted: false }
            } : false,
          }
        } : false,
        invoices: paths.has('invoices') ? {
          where: { deleted: false },
          include: {
            receipts: paths.has('invoices.receipts') ? {
              where: { deleted: false },
            } : false,
          },
        } : false
      },
    });
  }

  async listProjectActivities(projectId: number, params: ProjectActivityQueryParams) {
    return await this.prismaService.client.projectActivity.findMany({
      where: {
        deleted: false,
        projectId,
      },
      include: {
        activityTemplate: params.activityTemplate || params['activityTemplate.product'] || params['activityTemplate.supplier'] ? {
          include: {
            supplier: !!params['activityTemplate.supplier'],
            product: !!params['activityTemplate.product'],
          },
        } : false,
        costs: !!params.costs ? {
          where: { deleted: false }
        } : false,
      },
    });
  }

  async getProject(id: number, paths?: QueryPaths) {
    return await this.prismaService.client.project.findFirst({
      where: {
        id,
        deleted: false,
        available: true,
      },
      include: {
        projectActivities: {
          where: { deleted: false },
          include: {
            activityTemplate: {
              include: {
                supplier: true,
                product: true,
              }
            }
          },
        },
        contract: {
          include: { client: true, }
        },
        areaAdmin: true,
        localAdmin: true,
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
