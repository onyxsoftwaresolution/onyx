import { Module } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { UserRepository } from '@modules/user/user.repository';
import { UserController } from '@modules/user/user.controller';

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UsersModule { }
