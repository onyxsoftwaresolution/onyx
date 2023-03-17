import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { DailyReportService } from '../service/daily-report.service';

@Controller({
  version: '1',
  path: ''
})
export class DailyReportController {
  constructor(public reportService: DailyReportService) { }

  @Get('daily-reports/:projectId')
  @Roles(Role.ADMIN, Role.USER)
  async listDailyReports(@Param('projectId') projectId: number) {
    return await this.reportService.listDailyReports(projectId);
  }

  @Put('daily-report/:projectId/:projectReportId?')
  @Roles(Role.ADMIN, Role.USER)
  async upsertDailyReport(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
    @Body() body: UpsertProjectReportDTO,
  ) {
    return await this.reportService.upsertDailyReport(projectId, projectReportId, body);
  }

  @Get('new-daily-report/:projectId')
  @Roles(Role.ADMIN, Role.USER)
  async getNewDailyReport(
    @Param('projectId') projectId: number
  ) {
    return await this.reportService.getNewDailyReport(projectId);
  }

  @Get('daily-report/:projectId/:projectReportId')
  @Roles(Role.ADMIN, Role.USER)
  async getDailyReport(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
  ) {
    return await this.reportService.getDailyReport(projectId, projectReportId);
  }

  // @Post('daily-report/:projectId/:projectReportId/:to')
  // @Roles(Role.ADMIN, Role.USER)
  // async sendDailyMail(
  //   @Param('projectId') projectId: number,
  //   @Param('projectReportId') projectReportId: number | undefined,
  //   @Param('to') to: string,
  // ) {
  //   await this.reportService.sendDailyMail(to, projectId, projectReportId);
  //   return ({ success: true });
  // }
}
