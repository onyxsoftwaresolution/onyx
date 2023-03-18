import { CacheModule } from '@common/cache/cache.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoogleApiService } from './googleapi.service';

@Module({
  imports: [CacheModule, ConfigModule],
  providers: [GoogleApiService],
  exports: [GoogleApiService],
})
export class GoogleApiModule { }
