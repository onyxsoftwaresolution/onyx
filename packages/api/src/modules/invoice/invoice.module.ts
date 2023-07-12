import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { InvoiceService } from './invoice.service';
import { InvoiceProvider } from './invoice.provider';
import { InvoiceController } from './invoice.controller';
import { EasyBillModule } from '@common/easybill/easybill.module';
import { ProjectModule } from '@modules/project/project.module';

@Module({
  imports: [PrismaModule, EasyBillModule, ProjectModule],
  providers: [InvoiceService, InvoiceProvider],
  controllers: [InvoiceController],
  exports: [InvoiceService],
})
export class InvoiceModule { }
