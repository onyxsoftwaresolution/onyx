import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
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
    debugger
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
    return await this.prismaService.client.projectReport.create({
      data: {
        date: dayjs().toDate(),
        projectId,
        dailyActivityReports: {
          createMany: {
            data: project.projectActivities.map(pa => ({
              dailyProjectActivityId: pa.id,
            }))
          }
        },
      },
    });
  }

  async createMonthlyReport(projectId: number) {
    debugger
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
    return await this.prismaService.client.projectReport.create({
      data: {
        date: dayjs().toDate(),
        projectId,
        monthlyActivityReports: {
          createMany: {
            data: project.projectActivities.map(pa => ({
              monthlyProjectActivityId: pa.id,
            }))
          }
        },
      },
    });
  }

  async getDailyReport(projectId: number) {
    await this.prismaService.client.projectReport.findFirst({
      where: { projectId, deleted: false },
      select: {
        dailyActivityReports: true,
      }
    });
  }

  async getMonthlyReport(projectId: number) {
    await this.prismaService.client.projectReport.findFirst({
      where: { projectId, deleted: false },
      select: {
        monthlyActivityReports: true,
      }
    });
  }
}
