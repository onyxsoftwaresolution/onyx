import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as dayjs from 'dayjs';

@Injectable()
export class ReportProvider {
  constructor(
    private prismaService: PrismaService,
  ) { }

  async listDailyReports(projectId: number) {
    return await this.prismaService.client.projectReport.findMany({
      where: { projectId, deleted: false, dailyActivityReports: { some: {} } },
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        date: true,
      }
    });
  }

  async listMonthlyReports(projectId: number) {
    return await this.prismaService.client.projectReport.findMany({
      where: { projectId, deleted: false, monthlyActivityReports: { some: {} } },
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        date: true,
      },
    });
  }

  async createDailyReport(projectId: number) {
    const project = await this.prismaService.client.project.findFirst({
      where: { id: projectId },
      select: {
        projectActivities: {
          select: {
            id: true,
          }
        }
      }
    });
    if (project.projectActivities.length === 0)
      throw new InternalServerErrorException();
    return await this.prismaService.client.projectReport.create({
      data: {
        date: dayjs().toDate(),
        projectId,
        // dailyActivityReports: {
        //   createMany: {
        //     data: project.projectActivities.map(pa => ({
        //       dailyProjectActivityId: pa.id,
        //     }))
        //   }
        // },
      },
    });
  }

  async createMonthlyReport(projectId: number) {
    const project = await this.prismaService.client.project.findFirst({
      where: { id: projectId },
      select: {
        projectActivities: {
          select: {
            id: true,
          }
        }
      }
    });
    if (project.projectActivities.length === 0)
      throw new InternalServerErrorException();
    return await this.prismaService.client.projectReport.create({
      data: {
        date: dayjs().toDate(),
        projectId,
        // monthlyActivityReports: {
        //   createMany: {
        //     data: project.projectActivities.map(pa => ({
        //       monthlyProjectActivityId: pa.id,
        //     }))
        //   }
        // },
      },
    });
  }

  async getDailyReport(projectReportId: number) {
    return await this.prismaService.client.projectReport.findFirst({
      where: { id: projectReportId, deleted: false },
      select: {
        dailyActivityReports: true,
      }
    });
  }

  async getMonthlyReport(projectReportId: number) {
    return await this.prismaService.client.projectReport.findFirst({
      where: { id: projectReportId, deleted: false },
      select: {
        monthlyActivityReports: true,
      }
    });
  }
}
