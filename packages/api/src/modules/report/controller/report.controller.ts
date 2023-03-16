import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { ReportService } from '../service/report.service';

@Controller({
  version: '1',
  path: ''
})
export class ReportController {
  constructor(public reportService: ReportService) { }

  @Get('daily-reports/:projectId')
  @Roles(Role.ADMIN, Role.USER)
  async listDailyReports(@Param('projectId') projectId: number) {
    return await this.reportService.listDailyReports(projectId);
  }

  @Get('monthly-reports/:projectId')
  @Roles(Role.ADMIN, Role.USER)
  async listMonthlyReports(@Param('projectId') projectId: number) {
    return await this.reportService.listMonthlyReports(projectId);
  }

  @Put('daily-report/:projectId/:projectReportId?')
  @Roles(Role.ADMIN, Role.USER)
  async upsertDailyReport(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
    @Body() body: UpsertProjectReportDTO,
    @Req() req: any,
  ) {
    return await this.reportService.upsertDailyReport(projectId, projectReportId, body);
  }

  @Put('monthly-report/:projectId/:projectReportId?')
  @Roles(Role.ADMIN, Role.USER)
  async upsertMonthlyReport(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
    @Body() body: UpsertProjectReportDTO,
    @Req() req: any,
  ) {
    return await this.reportService.upsertMonthlyReport(projectId, projectReportId, body);
  }

  @Get(['new-daily-report/:projectId', 'daily-report/:projectId/:projectReportId'])
  @Roles(Role.ADMIN, Role.USER)
  async getDailyReport(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
  ) {
    return await this.reportService.getDailyReport(projectId, projectReportId);
  }

  @Get(['new-monthly-report/:projectId/:month', 'monthly-report/:projectId/:projectReportId'])
  @Roles(Role.ADMIN, Role.USER)
  async getMonthlyReport(
    @Param('month') month: string,
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
  ) {
    return await this.reportService.getMonthlyReport(month, projectId, projectReportId);
  }

  @Post('daily-report/:projectId/:projectReportId/:to')
  @Roles(Role.ADMIN, Role.USER)
  async sendDailyMail(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
    @Param('to') to: string,
  ) {
    await this.reportService.sendDailyMail(to, projectId, projectReportId);
    return ({ success: true });
  }
}
