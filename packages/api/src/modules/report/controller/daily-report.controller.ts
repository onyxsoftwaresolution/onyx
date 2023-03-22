import { AllowAnonymous } from '@modules/auth/rbac/anonymous.decorator';
import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Post, Put, Res, SerializeOptions } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Response } from 'express';
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

  @Delete('daily-report/:projectReportId')
  @Roles(Role.ADMIN, Role.USER)
  async deleteDailyReport(
    @Param('projectReportId') projectReportId: number
  ) {
    return await this.reportService.deleteDailyReport(projectReportId);
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

  @Post('daily-report/:projectId/:projectReportId/:to')
  @SerializeOptions({
    strategy: 'exposeAll'
  })
  @Roles(Role.ADMIN, Role.USER)
  async sendDailyMail(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
    @Param('to') to: string,
  ) {
    return await this.reportService.sendDailyReportMail(to, projectId, projectReportId);
  }

  @Get('view-daily-report/:projectId/:projectReportId')
  @AllowAnonymous()
  async viewDailyReport(
    @Param('projectId') projectId: number,
    @Param('projectReportId') projectReportId: number | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.reportService.viewDailyReport(res, projectId, projectReportId)
  }
}
