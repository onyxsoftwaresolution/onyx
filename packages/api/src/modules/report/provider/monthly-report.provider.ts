import { PrismaService } from '@modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MonthlyReportProvider {
  constructor(
    private prismaService: PrismaService,
  ) { }

  async listMonthlyReports(projectId: number) {
    return await this.prismaService.client.projectReport.findMany({
      where: {
        projectId,
        deleted: false,
        monthlyActivityReports: { some: {} },
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        date: true,
      },
    });
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

  async deleteMonthlyReport(projectReportId: number) {
    return await this.prismaService.client.projectReport.update({
      where: { id: projectReportId },
      data: { deleted: true },
    });
  }

  async getNewMonthlyReport(projectId: number, month: string) {
    const moment = dayjs(month ?? null, 'YYYYMM');
    if (!moment.isValid()) {
      throw new BadRequestException({ message: 'Month is not valid!' })
    }
    const start = moment.startOf('month').startOf('day').toDate();
    const end = moment.endOf('month').endOf('day').toDate();
    const dailys = await this.prismaService.client.projectReport.findMany({
      where: {
        projectId,
        dailyActivityReports: { some: {} },
        date: { gte: start, lte: end },
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
    return ({
      id: -1,
      date: dayjs().toDate(),
      projectId: projectId,
      project: restProject,
      monthlyActivityReports: project.projectActivities.map(pa => ({
        monthlyProjectActivityId: pa.id,
        monthlyProjectActivity: pa,
        monthlyNoImplUnits: dailyActivityReportMap[pa.id] ?? 0,
        monthlyActivityCost: 0,
      })),
    });
  }

  async getMonthlyReport(projectId: number, projectReportId: number) {
    return await this.prismaService.client.projectReport.findFirst({
      where: { id: projectReportId, projectId, deleted: false },
      include: {
        project: {
          include: {
            areaAdmin: true,
            localAdmin: true,
          }
        },
        monthlyActivityReports: {
          include: {
            monthlyProjectActivity: true,
          }
        },
      }
    });
  }
}
