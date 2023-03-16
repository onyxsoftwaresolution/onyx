import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { ProjectReportOutDTO, ReportListItemOutDTO } from '../dtos/report-out.dto';
import { ReportProvider } from '../provider/report.provider';
import { getDailyPDF } from './report.pdf';

@Injectable()
export class ReportService {
  constructor(
    private reportProvider: ReportProvider,
    private readonly mailerService: MailerService
  ) { }

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

  async getMonthlyReport(month: string, projectId: number, projectReportId: number) {
    return new ProjectReportOutDTO(await this.reportProvider.getMonthlyReport(month, projectId, projectReportId));
  }

  async sendDailyMail(to: string, projectId: number, projectReportId: number) {
    const report = await this.getDailyReport(projectId, projectReportId);
    const pdf = await getDailyPDF(report);
    await this.mailerService.sendMail({
      to,
      from: 'onyxsoftwaresolution@gmail.com',
      subject: `Raport zilnic ${dayjs(report.date).format('DD/MM/YYYY')}`,
      text: '',
      html: '',
      attachments: [{
        filename: `Raport zilnic ${dayjs(report.date).format('DD/MM/YYYY')}`,
        contentType: `application/pdf`,
        contentDisposition: 'attachment',
        path: '',
        content: pdf,
      }]
    });
  }
}
