import { Injectable } from '@nestjs/common';
import { ReportListItemOutDTO } from '../dtos/report-out.dto';
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

  async createDailyReport(projectId: number) {
    return await this.reportProvider.createDailyReport(projectId);
  }

  async createMonthlyReport(projectId: number) {
    return await this.reportProvider.createMonthlyReport(projectId);
  }
}
