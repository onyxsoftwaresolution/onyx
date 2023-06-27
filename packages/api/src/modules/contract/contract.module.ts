import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ContractService } from './contract.service';
import { ContractProvider } from './contract.provider';
import { ContractController } from './contract.controller';

@Module({
  imports: [PrismaModule],
  providers: [ContractService, ContractProvider],
  controllers: [ContractController],
  exports: [ContractService],
})
export class ContractModule { }
