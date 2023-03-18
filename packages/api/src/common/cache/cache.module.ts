import { ConfigModule } from '@common/config/config.module';
import { ConfigService } from '@common/config/config.service';
import { CacheModule as NestCacheModule, Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL'),
        isGlobal: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule { }
