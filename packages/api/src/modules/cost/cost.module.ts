import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { CostService } from './cost.service';
import { CostProvider } from './cost.provider';
import { CostController } from './cost.controller';

@Module({
  imports: [PrismaModule],
  providers: [CostService, CostProvider],
  controllers: [CostController],
  exports: [CostService],
})
export class CostModule { }
