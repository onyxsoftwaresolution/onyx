import { Module } from '@nestjs/common';
import { UserService } from '@modules/user/service/user.service';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { UserRepository } from '@modules/user/repository/user.repository';
import { UserController } from '@modules/user/controller/user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UsersModule {}
