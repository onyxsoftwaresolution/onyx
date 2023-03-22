import { ConfigService } from '@common/config/config.service';
import { GoogleApiService } from '@common/googleapi/googleapi.service';
import { Injectable, StreamableFile } from '@nestjs/common';
import dayjs from 'dayjs';
import { Response } from 'express';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { ProjectReportOutDTO, ReportListItemOutDTO } from '../dtos/report-out.dto';
import { MonthlyReportProvider } from '../provider/monthly-report.provider';
import { getMonthlyPDF } from './pdf/monthly.pdf';

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

  async deleteMonthlyReport(projectReportId: number) {
    return new ProjectReportOutDTO(await this.reportProvider.deleteMonthlyReport(projectReportId));
  }

  async getNewMonthlyReport(projectId: number, month: string) {
    return new ProjectReportOutDTO(await this.reportProvider.getNewMonthlyReport(projectId, month));
  }

  async getMonthlyReport(projectId: number, projectReportId: number) {
    return new ProjectReportOutDTO(await this.reportProvider.getMonthlyReport(projectId, projectReportId));
  }

  getReportDate(report: ProjectReportOutDTO) {
    return dayjs(report.date).format('YYYYMM');
  }

  getFileName(report: ProjectReportOutDTO) {
    return `raport_lunar_${this.getReportDate(report)}.pdf`;
  }

  async sendMonthlyReportMail(to: string, projectId: number, projectReportId: number) {
    const report = await this.getMonthlyReport(projectId, projectReportId);
    const pdf = await getMonthlyPDF(report);
    const message = await this.gapi.createMessage(
      to,
      'me',
      `Raport lunar ${this.getReportDate(report).replace("_", " ")}`,
      '',
      [
        {
          filename: this.getFileName(report),
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
      'Content-Disposition': `filename=raport_lunar_${this.getFileName(report)}.pdf`,
      // 'Content-Type': 'application/pdf',
      // 'Content-Disposition': `attachment;filename=raport_lunar_${this.getFileName(report)}.pdf`,
    });
    return new StreamableFile(pdf);
  }
}
