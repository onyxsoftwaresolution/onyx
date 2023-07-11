import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  UpsertInvoiceDTO,
} from './dtos/invoice.in.dto';
import { QueryParams } from '@common/QueryParams';

@Injectable()
export class InvoiceProvider {
  constructor(private prismaService: PrismaService) { }

  async listProjectInvoices(projectId: number) {
    return await this.prismaService.client.invoice.findMany({
      where: {
        deleted: false,
        projectId,
      },
    });
  }

  async getInvoice(id: number, paths: QueryParams) {
    return await this.prismaService.client.invoice.findFirst({
      where: {
        id,
        deleted: false,
      },
      include: {
        project: paths.has('project') ? {
          include: {
            contract: paths.has('project.contract') ? {
              include: {
                client: paths.has('project.contract.client'),
              },
            } : false,
            projectActivities: paths.has('project.projectActivities') ? {
              include: {
                activityTemplate: paths.has('project.projectActivities.activityTemplate') ? {
                  include: {
                    product: paths.has('project.projectActivities.activityTemplate.product'),
                  },
                } : false,
              },
            } : false,
          }
        } : false,
      }
    });
  }

  async upsertInvoice({ id, number, issueDate, dueDate, projectId }: UpsertInvoiceDTO) {
    return await this.prismaService.client.invoice.upsert({
      where: id != null ? { id } : { id: -1 },
      create: { projectId, issueDate, dueDate },
      update: { id, projectId, issueDate, dueDate },
    });
  }

  async deleteInvoice(id: number) {
    return await this.prismaService.client.invoice.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
