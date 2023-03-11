import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { Role } from '@prisma/client';
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

  @Get('daily-report/:projectReportId')
  @Roles(Role.ADMIN, Role.USER)
  async getDailyReports(@Param('projectReportId') projectReportId: number) {
    return await this.reportService.getDailyReport(projectReportId);
  }

  @Get('monthly-report/:projectReportId')
  @Roles(Role.ADMIN, Role.USER)
  async getMonthlyReports(@Param('projectReportId') projectReportId: number) {
    return await this.reportService.getMonthlyReport(projectReportId);
  }

  @Post('daily-report/:projectId')
  @Roles(Role.ADMIN, Role.USER)
  async createDailyReport(
    @Param('projectId') projectId: number,
    @Body() body: any,
    @Req() req: any,
  ) {
    return await this.reportService.createDailyReport(projectId);
  }

  @Post('monthly-report/:projectId')
  @Roles(Role.ADMIN, Role.USER)
  async createMonthlyReport(
    @Param('projectId') projectId: number,
    @Body() body: any,
    @Req() req: any,
  ) {
    return await this.reportService.createMonthlyReport(projectId);
  }
}
