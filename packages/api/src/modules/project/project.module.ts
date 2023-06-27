import { PrismaModule } from '@modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectProvider } from './project.provider';
import { ProjectService } from './project.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectProvider],
  exports: [ProjectService],
})
export class ProjectModule { }
