import { GoogleApiService } from '@common/googleapi/googleapi.service';
import { Injectable, StreamableFile } from '@nestjs/common';
import dayjs from 'dayjs';
import { Response } from 'express';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { ProjectReportOutDTO, ReportListItemOutDTO } from '../dtos/report-out.dto';
import { DailyReportProvider } from '../provider/daily-report.provider';
import { getDailyPDF } from './pdf/daily.pdf';

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

  async deleteDailyReport(projectReportId: number) {
    return new ProjectReportOutDTO(await this.reportProvider.deleteDailyReport(projectReportId));
  }

  async getNewDailyReport(projectId: number) {
    return new ProjectReportOutDTO(await this.reportProvider.getNewDailyReport(projectId));
  }

  async getDailyReport(projectId: number, projectReportId: number | undefined) {
    return new ProjectReportOutDTO(await this.reportProvider.getDailyReport(projectId, projectReportId));
  }

  getReportDate(report: ProjectReportOutDTO) {
    return dayjs(report.date).format('YYYYMMDD_HHmm');
  }

  getFileName(report: ProjectReportOutDTO) {
    return `raport_zilnic_${this.getReportDate(report)}.pdf`;
  }

  async sendDailyReportMail(to: string, projectId: number, projectReportId: number) {
    const report = await this.getDailyReport(projectId, projectReportId);
    const pdf = await getDailyPDF(report);
    const message = await this.gapi.createMessage(
      to,
      'me',
      `Raport zilnic ${this.getReportDate(report).replace("_", " ")}`,
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

  async viewDailyReport(res: Response, projectId: number, projectReportId: number) {
    const report = await this.getDailyReport(projectId, projectReportId);
    const pdf = await getDailyPDF(report);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `filename=${this.getFileName(report)}`,
      // 'Content-Type': 'application/pdf',
      // 'Content-Disposition': `attachment;filename=${this.getFileName(report)}`,
    });
    return new StreamableFile(pdf);
  }
}
