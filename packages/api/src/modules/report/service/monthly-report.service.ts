import { Injectable } from '@nestjs/common';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { ProjectReportOutDTO, ReportListItemOutDTO } from '../dtos/report-out.dto';
import { MonthlyReportProvider } from '../provider/monthly-report.provider';

@Injectable()
export class MonthlyReportService {
  constructor(
    private reportProvider: MonthlyReportProvider
  ) { }

  async listMonthlyReports(projectId: number) {
    const reports = await this.reportProvider.listMonthlyReports(projectId);
    return reports.map(r => new ReportListItemOutDTO(r));
  }

  async upsertMonthlyReport(projectId: number, projectReportId: number | undefined, body: UpsertProjectReportDTO) {
    return new ProjectReportOutDTO(await this.reportProvider.upsertMonthlyReport(projectId, projectReportId, body));
  }

  async getNewMonthlyReport(projectId: number, month: string) {
    return new ProjectReportOutDTO(await this.reportProvider.getNewMonthlyReport(projectId, month));
  }

  async getMonthlyReport(projectId: number, projectReportId: number) {
    return new ProjectReportOutDTO(await this.reportProvider.getMonthlyReport(projectId, projectReportId));
  }
}
