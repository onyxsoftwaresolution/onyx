import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { MonthlyReportService } from '../service/monthly-report.service';

@Controller({
  version: '1',
  path: ''
})
export class MonthlyReportController {
  constructor(public reportService: MonthlyReportService) { }

  @Get('monthly-reports/:projectId')
  @Roles(Role.ADMIN, Role.USER)
  async listMonthlyReports(@Param('projectId') projectId: number) {
    return await this.reportService.listMonthlyReports(projectId);
  }

  @Put('monthly-report/:projectId/:projectReportId?')
  @Roles(Role.ADMIN, Role.USER)
  async upsertMonthlyReport(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
    @Body() body: UpsertProjectReportDTO,
  ) {
    return await this.reportService.upsertMonthlyReport(projectId, projectReportId, body);
  }

  @Get('new-monthly-report/:projectId/:month')
  @Roles(Role.ADMIN, Role.USER)
  async getNewMonthlyReport(
    @Param('month') month: string,
    @Param('projectId') projectId: number,
  ) {
    return await this.reportService.getNewMonthlyReport(projectId, month);
  }

  @Get('monthly-report/:projectId/:projectReportId')
  @Roles(Role.ADMIN, Role.USER)
  async getMonthlyReport(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number,
  ) {
    return await this.reportService.getMonthlyReport(projectId, projectReportId);
  }
}
