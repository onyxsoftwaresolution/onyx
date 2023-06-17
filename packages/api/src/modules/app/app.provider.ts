import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppProvider {
  constructor(private prismaService: PrismaService) { }

  async keepAlive() {
    await this.prismaService.client.user.findFirst({
      select: { id: true, }
    });
  }
}
