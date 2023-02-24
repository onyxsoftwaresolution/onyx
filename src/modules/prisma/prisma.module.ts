import { Module } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { ConfigModule } from '@common/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
