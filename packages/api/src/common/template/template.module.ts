import { CacheModule } from '@common/cache/cache.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TemplateService } from './template.service';
import { TemplateProvider } from './template.provider';

@Module({
  imports: [CacheModule, ConfigModule],
  providers: [TemplateService, TemplateProvider],
  exports: [TemplateService],
})
export class TemplateModule { }
