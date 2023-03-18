import { GoogleApiService } from '@common/googleapi/googleapi.service';
import { Injectable, StreamableFile } from '@nestjs/common';
import dayjs from 'dayjs';
import { Response } from 'express';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { ProjectReportOutDTO, ReportListItemOutDTO } from '../dtos/report-out.dto';
import { DailyReportProvider } from '../provider/daily-report.provider';
import { getDailyPDF } from './report.pdf';

@Injectable()
export class DailyReportService {
  constructor(
    private reportProvider: DailyReportProvider,
    private gapi: GoogleApiService,
  ) { }

  async listDailyReports(projectId: number) {
    const reports = await this.reportProvider.listDailyReports(projectId);
    return reports.map(r => new ReportListItemOutDTO(r));
  }

  async upsertDailyReport(projectId: number, projectReportId: number | undefined, body: UpsertProjectReportDTO) {
    return new ProjectReportOutDTO(await this.reportProvider.upsertDailyReport(projectId, projectReportId, body));
  }

  async getNewDailyReport(projectId: number) {
    return new ProjectReportOutDTO(await this.reportProvider.getNewDailyReport(projectId));
  }

  async getDailyReport(projectId: number, projectReportId: number | undefined) {
    return new ProjectReportOutDTO(await this.reportProvider.getDailyReport(projectId, projectReportId));
  }

  async sendDailyReportMail(to: string, projectId: number, projectReportId: number) {
    const report = await this.getDailyReport(projectId, projectReportId);
    const pdf = await getDailyPDF(report);
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

  async viewDailyReport(res: Response, projectId: number, projectReportId: number) {
    const report = await this.getDailyReport(projectId, projectReportId);
    const pdf = await getDailyPDF(report);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `filename=raport_zilnic_${dayjs(report.date).format('YYYYMMDD_HHmm')}.pdf`,
      // 'Content-Type': 'application/pdf',
      // 'Content-Disposition': `attachment;filename=raport_zilnic_${dayjs(report.date).format('YYYYMMDD_HHmm')}.pdf`,
    });
    return new StreamableFile(pdf);
  }
}
