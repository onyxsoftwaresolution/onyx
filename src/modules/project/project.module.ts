import { PrismaModule } from '@modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectProvider } from './provider/project.provider';
import { ProjectService } from './service/project.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectProvider],
  exports: [ProjectService],
})
export class ProjectModule {}
