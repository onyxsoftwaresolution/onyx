import { PrismaService } from '@modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { Prisma } from '@prisma/client';

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

  async upsertDailyReport(
    projectId: number,
    projectReportId: number | undefined,
    { date, dailyActivityReports }: UpsertProjectReportDTO
  ) {
    if (isNaN(projectReportId) || projectReportId <= 0)
      projectReportId = undefined;
    const args: Prisma.SelectSubset<Prisma.ProjectReportUpsertArgs, Prisma.ProjectReportUpsertArgs> = {
      where: { id: projectReportId ?? -1 },
      create: {
        date,
        projectId,
        dailyActivityReports: {
          create: dailyActivityReports.map(({ todayStock, addedStock, totalStock, noImplToday, finalStockToday, totalImplToday, totalProjectUnits, remainingUnits, dailyProjectActivityId }) => ({
            todayStock, addedStock, totalStock, noImplToday, finalStockToday, totalImplToday, totalProjectUnits, remainingUnits, dailyProjectActivityId
          })),
        },
      },
      update: {
        date,
        projectId,
        dailyActivityReports: {
          update: dailyActivityReports.map(({ id, todayStock, addedStock, totalStock, noImplToday, finalStockToday, totalImplToday, totalProjectUnits, remainingUnits, dailyProjectActivityId }) => ({
            where: { id: id ?? -1 },
            data: { todayStock, addedStock, totalStock, noImplToday, finalStockToday, totalImplToday, totalProjectUnits, remainingUnits, dailyProjectActivityId }
          })),
        }
      },
    }
    return await this.prismaService.client.projectReport.upsert(args);
  }

  async upsertMonthlyReport(
    projectId: number,
    projectReportId: number | undefined,
    { date, monthlyActivityReports }: UpsertProjectReportDTO
  ) {
    if (isNaN(projectReportId) || projectReportId <= 0)
      projectReportId = undefined;
    const args: Prisma.SelectSubset<Prisma.ProjectReportUpsertArgs, Prisma.ProjectReportUpsertArgs> = {
      where: { id: projectReportId ?? -1 },
      create: {
        date,
        projectId,
        monthlyActivityReports: {
          create: monthlyActivityReports.map(({ monthlyNoImplUnits, monthlyActivityCost, monthlyProjectActivityId }) => ({
            monthlyNoImplUnits, monthlyActivityCost, monthlyProjectActivityId
          })),
        },
      },
      update: {
        date,
        projectId,
        monthlyActivityReports: {
          update: monthlyActivityReports.map(({ id, monthlyNoImplUnits, monthlyActivityCost }) => ({
            where: { id: id ?? -1 },
            data: { monthlyNoImplUnits, monthlyActivityCost }
          })),
        }
      },
    }
    return await this.prismaService.client.projectReport.upsert(args);
  }

  async getDailyReport(projectId: number, projectReportId: number | undefined) {
    if (projectReportId != null && !isNaN(projectReportId)) {
      return await this.prismaService.client.projectReport.findFirst({
        where: { id: projectReportId, deleted: false },
        include: {
          project: true,
          dailyActivityReports: {
            include: {
              dailyProjectActivity: true,
            }
          },
        }
      });
    }
    const project = await this.prismaService.client.project.findFirst({
      where: { id: projectId, deleted: false },
      include: {
        projectActivities: true,
      }
    });
    const { projectActivities, ...restProject } = project;
    const previousReport = await this.prismaService.client.projectReport.findFirst({
      where: { projectId },
      orderBy: {
        date: 'desc',
      },
      include: {
        dailyActivityReports: true
      }
    });
    const map = new Map<number, typeof previousReport['dailyActivityReports'][0]>();
    previousReport?.dailyActivityReports?.forEach(dar => {
      map.set(dar.dailyProjectActivityId, dar);
    });
    return ({
      id: -1,
      date: dayjs().toDate(),
      projectId: projectId,
      project: restProject,
      dailyActivityReports: project.projectActivities.map(pa => ({
        dailyProjectActivityId: pa.id,
        dailyProjectActivity: pa,
        todayStock: map.get(pa.id)?.finalStockToday ?? 0,
        addedStock: 0,
        totalStock: 0,
        noImplToday: 0,
        finalStockToday: map.get(pa.id)?.finalStockToday ?? 0,
        totalImplToday: 0,
        totalProjectUnits: pa.quantity,
        remainingUnits: 0,
      })),
    });
  }

  async getMonthlyReport(month: string, projectId: number, projectReportId: number | undefined) {
    const day = dayjs(month ?? null, 'YYYYMM');
    if (!day.isValid() && projectReportId == null) {
      throw new BadRequestException({ message: 'Month is not valid!' })
    }
    if (projectReportId != null && !isNaN(projectReportId)) {
      return await this.prismaService.client.projectReport.findFirst({
        where: { id: projectReportId, deleted: false },
        include: {
          project: true,
          monthlyActivityReports: {
            include: {
              monthlyProjectActivity: true,
            }
          },
        }
      });
    }
    const project = await this.prismaService.client.project.findFirst({
      where: { id: projectId, deleted: false },
      include: {
        projectActivities: true,
      }
    });
    const { projectActivities, ...restProject } = project;
    return ({
      id: -1,
      date: dayjs().toDate(),
      projectId: projectId,
      project: restProject,
      monthlyActivityReports: project.projectActivities.map(pa => ({
        monthlyProjectActivityId: pa.id,
        monthlyProjectActivity: pa,
        monthlyNoImplUnits: 0,
        monthlyActivityCost: 0,
      })),
    });
  }
}
