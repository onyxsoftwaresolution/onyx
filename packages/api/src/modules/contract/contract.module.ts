import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ContractService } from './service/contract.service';
import { ContractProvider } from './provider/contract.provider';
import { ContractController } from './controller/contract.controller';

@Module({
  imports: [PrismaModule],
  providers: [ContractService, ContractProvider],
  controllers: [ContractController],
  exports: [ContractService],
})
export class ContractModule { }
