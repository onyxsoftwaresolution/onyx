import { ConfigService } from '@common/config/config.service';
import { GoogleApiService } from '@common/googleapi/googleapi.service';
import { Injectable, StreamableFile } from '@nestjs/common';
import dayjs from 'dayjs';
import { Response } from 'express';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { ProjectReportOutDTO, ReportListItemOutDTO } from '../dtos/report-out.dto';
import { MonthlyReportProvider } from '../provider/monthly-report.provider';
import { getMonthlyPDF } from './report.pdf';

@Injectable()
export class MonthlyReportService {
  constructor(
    private reportProvider: MonthlyReportProvider,
    private configService: ConfigService,
    private gapi: GoogleApiService,
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

  async sendMonthlyReportMail(to: string, projectId: number, projectReportId: number) {
    const report = await this.getMonthlyReport(projectId, projectReportId);
    const pdf = await getMonthlyPDF(report);
    const message = await this.gapi.createMessage(
      to,
      'me',
      'Test email with attachment',
      'Hello, this is a test email with a PDF attachment.',
      [
        {
          filename: 'attachment.pdf',
          content: pdf.toString('base64'),
          encoding: 'base64',
        }
      ]
    );
    await this.gapi.setCredentials();
    const { status, statusText } = await this.gapi.sendGmail(message);
    return ({ status, statusText });
  }

  async viewMonthlyReport(res: Response, projectId: number, projectReportId: number) {
    const report = await this.getMonthlyReport(projectId, projectReportId);
    const pdf = await getMonthlyPDF(report);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `filename=raport_lunar_${dayjs(report.date).format('YYYYMMDD_HHmm')}.pdf`,
      // 'Content-Type': 'application/pdf',
      // 'Content-Disposition': `attachment;filename=raport_lunar_${dayjs(report.date).format('YYYYMMDD_HHmm')}.pdf`,
    });
    return new StreamableFile(pdf);
  }
}
