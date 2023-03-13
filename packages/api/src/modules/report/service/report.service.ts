import { ProjectActivityOutDTO } from '@modules/project/dtos/project.out.dto';
import { Injectable } from '@nestjs/common';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { ActivityReportOutDTO, ProjectReportOutDTO, ReportListItemOutDTO } from '../dtos/report-out.dto';
import { ReportProvider } from '../provider/report.provider';

@Injectable()
export class ReportService {
  constructor(private reportProvider: ReportProvider) { }

  async listDailyReports(projectId: number) {
    const reports = await this.reportProvider.listDailyReports(projectId);
    return reports.map(r => new ReportListItemOutDTO(r));
  }

  async listMonthlyReports(projectId: number) {
    const reports = await this.reportProvider.listMonthlyReports(projectId);
    return reports.map(r => new ReportListItemOutDTO(r));
  }

  async upsertDailyReport(projectId: number, projectReportId: number | undefined, body: UpsertProjectReportDTO) {
    return new ProjectReportOutDTO(await this.reportProvider.upsertDailyReport(projectId, projectReportId, body));
  }

  async upsertMonthlyReport(projectId: number, projectReportId: number | undefined, body: UpsertProjectReportDTO) {
    return new ProjectReportOutDTO(await this.reportProvider.upsertMonthlyReport(projectId, projectReportId, body));
  }

  async getDailyReport(projectId: number, projectReportId: number | undefined) {
    return new ProjectReportOutDTO(await this.reportProvider.getDailyReport(projectId, projectReportId));
  }

  async getMonthlyReport(projectId: number, projectReportId: number) {
    return new ProjectReportOutDTO(this.reportProvider.getMonthlyReport(projectId, projectReportId));
  }
}
