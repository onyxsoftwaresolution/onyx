import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DailyReportProvider {
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

  async deleteDailyReport(projectReportId: number) {
    return await this.prismaService.client.projectReport.update({
      where: { id: projectReportId },
      data: { deleted: true },
    });
  }

  async getNewDailyReport(projectId: number) {
    const project = await this.prismaService.client.project.findFirst({
      where: { id: projectId, deleted: false },
      include: {
        projectActivities: {
          where: { deleted: false },
        },
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { projectActivities, ...restProject } = project;
    const previousReport = await this.prismaService.client.projectReport.findFirst({
      where: {
        projectId,
        dailyActivityReports: { some: {} },
        deleted: false,
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        dailyActivityReports: {
          where: { deleted: false }
        }
      }
    });
    const lastDailyActivityReportMap = new Map<number, typeof previousReport['dailyActivityReports'][0]>();
    previousReport?.dailyActivityReports?.forEach(dar => {
      lastDailyActivityReportMap.set(dar.dailyProjectActivityId, dar);
    });
    const dailys = await this.prismaService.client.projectReport.findMany({
      where: {
        projectId,
        dailyActivityReports: { some: {} },
        deleted: false,
      },
      select: {
        dailyActivityReports: {
          where: {
            deleted: false,
            dailyProjectActivity: { deleted: false },
          },
          select: {
            noImplToday: true,
            dailyProjectActivityId: true,
          }
        }
      }
    });
    const dailyActivityReportMap = {} as { [activityId: number]: any };
    for (const projectReport of dailys) {
      for (const activityReport of projectReport.dailyActivityReports) {
        dailyActivityReportMap[activityReport.dailyProjectActivityId] =
          (dailyActivityReportMap[activityReport.dailyProjectActivityId] ?? 0) + activityReport.noImplToday;
      }
    }
    return ({
      id: -1,
      date: dayjs().toDate(),
      projectId: projectId,
      project: restProject,
      dailyActivityReports: project.projectActivities.map(pa => {
        const totalImplToday = dailyActivityReportMap[pa.id];
        return ({
          dailyProjectActivityId: pa.id,
          dailyProjectActivity: pa,
          todayStock: lastDailyActivityReportMap.get(pa.id)?.finalStockToday ?? 0,
          addedStock: 0,
          totalStock: lastDailyActivityReportMap.get(pa.id)?.totalStock ?? 0,
          noImplToday: 0,
          finalStockToday: lastDailyActivityReportMap.get(pa.id)?.finalStockToday ?? 0,
          totalImplToday: totalImplToday ?? 0,
          totalProjectUnits: lastDailyActivityReportMap.get(pa.id)?.totalProjectUnits ?? pa.quantity ?? 0,
          remainingUnits: lastDailyActivityReportMap.get(pa.id)?.remainingUnits ?? pa.quantity ?? 0,
        })
      }),
    });
  }

  async getDailyReport(projectId: number, projectReportId: number) {
    return await this.prismaService.client.projectReport.findFirst({
      where: { id: projectReportId, projectId, deleted: false },
      include: {
        project: {
          include: {
            localAdmin: true,
            areaAdmin: true,
          }
        },
        dailyActivityReports: {
          include: {
            dailyProjectActivity: true,
          }
        },
      }
    });
  }
}
