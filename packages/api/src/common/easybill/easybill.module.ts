import { CacheModule } from '@common/cache/cache.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EasyBillService } from './easybill.service';
import { EasyBillProvider } from './easybill.provider';

@Module({
  imports: [CacheModule, ConfigModule],
  providers: [EasyBillService, EasyBillProvider],
  exports: [EasyBillService],
})
export class EasyBillModule { }
