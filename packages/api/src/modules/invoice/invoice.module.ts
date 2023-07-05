import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { InvoiceService } from './invoice.service';
import { InvoiceProvider } from './invoice.provider';
import { InvoiceController } from './invoice.controller';

@Module({
  imports: [PrismaModule],
  providers: [InvoiceService, InvoiceProvider],
  controllers: [InvoiceController],
  exports: [InvoiceService],
})
export class InvoiceModule { }
