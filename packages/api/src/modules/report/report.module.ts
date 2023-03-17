import { Module } from '@nestjs/common';
import { DailyReportService } from './service/daily-report.service';
import { MonthlyReportService } from './service/monthly-report.service';
import { DailyReportProvider } from './provider/daily-report.provider';
import { MonthlyReportProvider } from './provider/monthly-report.provider';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { DailyReportController } from './controller/daily-report.controller';
import { MonthlyReportController } from './controller/monthly-report.controller';

@Module({
  imports: [PrismaModule],
  providers: [DailyReportService, MonthlyReportService, DailyReportProvider, MonthlyReportProvider],
  exports: [DailyReportService, MonthlyReportService],
  controllers: [DailyReportController, MonthlyReportController]
})
export class ReportModule { }
