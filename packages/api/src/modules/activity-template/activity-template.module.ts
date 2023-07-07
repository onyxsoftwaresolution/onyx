import { PrismaModule } from '@modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ActivityTemplateController } from './activity-template.controller';
import { ActivityTemplateProvider } from './activity-template.provider';
import { ActivityTemplateService } from './activity-template.service';

@Module({
  imports: [PrismaModule],
  providers: [ActivityTemplateService, ActivityTemplateProvider],
  controllers: [ActivityTemplateController],
  exports: [ActivityTemplateService],
})
export class ActivityTemplateModule { }
