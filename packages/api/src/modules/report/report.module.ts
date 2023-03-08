import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportProvider } from './report.provider';
import { PrismaModule } from '@modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ReportService, ReportProvider],
  exports: [ReportService]
})
export class ReportModule { }
