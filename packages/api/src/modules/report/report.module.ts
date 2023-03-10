import { Module } from '@nestjs/common';
import { ReportService } from './service/report.service';
import { ReportProvider } from './provider/report.provider';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ReportController } from './controller/report.controller';

@Module({
  imports: [PrismaModule],
  providers: [ReportService, ReportProvider],
  exports: [ReportService],
  controllers: [ReportController]
})
export class ReportModule { }
