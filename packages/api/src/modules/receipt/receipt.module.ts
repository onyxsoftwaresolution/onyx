import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ReceiptService } from './receipt.service';
import { ReceiptProvider } from './receipt.provider';
import { ReceiptController } from './receipt.controller';

@Module({
  imports: [PrismaModule],
  providers: [ReceiptService, ReceiptProvider],
  controllers: [ReceiptController],
  exports: [ReceiptService],
})
export class ReceiptModule { }
