import { Injectable } from '@nestjs/common';
import { UpsertProjectReportDTO } from '../dtos/report-in.dto';
import { ProjectReportOutDTO, ReportListItemOutDTO } from '../dtos/report-out.dto';
import { DailyReportProvider } from '../provider/daily-report.provider';

@Injectable()
export class DailyReportService {
  constructor(
    private reportProvider: DailyReportProvider,
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

  // async sendDailyMail(to: string, projectId: number, projectReportId: number) {
  //   const report = await this.getDailyReport(projectId, projectReportId);
  //   const pdf = await getDailyPDF(report);
  //   await this.mailerService.sendMail({
  //     to,
  //     from: 'onyxsoftwaresolution@gmail.com',
  //     subject: `Raport zilnic ${dayjs(report.date).format('DD/MM/YYYY')}`,
  //     text: '',
  //     html: '',
  //     attachments: [{
  //       filename: `Raport zilnic ${dayjs(report.date).format('DD/MM/YYYY')}`,
  //       contentType: `application/pdf`,
  //       contentDisposition: 'attachment',
  //       path: '',
  //       content: pdf,
  //     }]
  //   });
  // }
}
