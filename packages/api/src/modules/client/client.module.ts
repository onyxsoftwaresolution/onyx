import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ClientService } from './client.service';
import { ClientProvider } from './client.provider';
import { ClientController } from './client.controller';

@Module({
  imports: [PrismaModule],
  providers: [ClientService, ClientProvider],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule { }
