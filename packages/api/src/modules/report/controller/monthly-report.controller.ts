import { AllowAnonymous } from '@modules/auth/rbac/anonymous.decorator';
import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Get, Param, Post, Put, Res, SerializeOptions } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { MonthlyReportService } from '../service/monthly-report.service';

@Controller({
  version: '1',
  path: ''
})
export class MonthlyReportController {
  constructor(public reportService: MonthlyReportService) { }

  @Get('monthly-reports/:projectId')
  @Roles(Role.ADMIN)
  async listMonthlyReports(@Param('projectId') projectId: number) {
    return await this.reportService.listMonthlyReports(projectId);
  }

  @Put('monthly-report/:projectId/:projectReportId?')
  @Roles(Role.ADMIN)
  async upsertMonthlyReport(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
    @Body() body: UpsertProjectReportDTO,
  ) {
    return await this.reportService.upsertMonthlyReport(projectId, projectReportId, body);
  }

  @Get('new-monthly-report/:projectId/:month')
  @Roles(Role.ADMIN)
  async getNewMonthlyReport(
    @Param('month') month: string,
    @Param('projectId') projectId: number,
  ) {
    return await this.reportService.getNewMonthlyReport(projectId, month);
  }

  @Get('monthly-report/:projectId/:projectReportId')
  @Roles(Role.ADMIN)
  async getMonthlyReport(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number,
  ) {
    return await this.reportService.getMonthlyReport(projectId, projectReportId);
  }

  @Post('monthly-report/:projectId/:projectReportId/:to')
  @SerializeOptions({
    strategy: 'exposeAll'
  })
  @Roles(Role.ADMIN)
  async sendMonthlyReportMail(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
    @Param('to') to: string,
  ) {
    await this.reportService.sendMonthlyReportMail(to, projectId, projectReportId);
    return ({ success: true });
  }

  @Get('view-monthly-report/:projectId/:projectReportId')
  @AllowAnonymous()
  async viewmonthlyReport(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.reportService.viewMonthlyReport(res, projectId, projectReportId)
  }
}
