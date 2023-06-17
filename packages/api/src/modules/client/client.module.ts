import { Module } from '@nestjs/common';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ClientService } from './service/client.service';
import { ClientProvider } from './provider/client.provider';
import { ClientController } from './controller/client.controller';

@Module({
  imports: [PrismaModule],
  providers: [ClientService, ClientProvider],
  controllers: [ClientController],
  exports: [ClientService],
})
export class ClientModule { }
