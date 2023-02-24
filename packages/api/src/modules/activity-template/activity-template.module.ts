import { PrismaModule } from '@modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ActivityTemplateController } from './controller/activity-template.controller';
import { ActivityTemplateProvider } from './provider/activity-template.provider';
import { ActivityTemplateService } from './service/activity-template.service';

@Module({
  imports: [PrismaModule],
  providers: [ActivityTemplateService, ActivityTemplateProvider],
  controllers: [ActivityTemplateController],
  exports: [ActivityTemplateService],
})
export class ActivityTemplateModule {}
