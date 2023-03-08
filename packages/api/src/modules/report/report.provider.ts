import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportProvider {
  constructor(private prismaService: PrismaService) { }

  async listDailyReports(projectId: number) {
    await this.prismaService.client.projectReport.findMany({
      where: { projectId, deleted: false },
      orderBy: {
        date: 'desc',
      },
      select: {
        daily: true,
      }
    });
  }

  async listMonthlyReports(projectId: number) {
    await this.prismaService.client.projectReport.findMany({
      where: { projectId, deleted: false },
      orderBy: {
        date: 'desc',
      },
      select: {
        monthly: true,
      }
    });
  }

  async listSiteReports(projectId: number) {
    await this.prismaService.client.projectReport.findMany({
      where: { projectId, deleted: false },
      orderBy: {
        date: 'desc',
      },
      select: {
        site: true,
      }
    });
  }

  async getDailyReport(projectId: number) {
    await this.prismaService.client.projectReport.findFirst({
      where: { projectId, deleted: false },
      select: {
        daily: true,
      }
    });
  }
}
