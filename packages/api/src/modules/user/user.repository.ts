import { ConfigService } from '@common/config/config.service';
import { Security } from '@common/security/Secutity';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDTO } from './dtos/user.create.dto';

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,
    private config: ConfigService,
  ) { }

  async upsertUser({ id, username, password, role }: CreateUserDTO): Promise<User> {
    const saltOrRounds = this.config.get('SALT_OR_ROUNDS');
    const hash = await Security.createPasswordHash(password, saltOrRounds);
    const user = await this.prismaService.client.user.findFirst({
      where: { username },
    })
    return await this.prismaService.client.user.upsert({
      where: { id: id ?? user?.id ?? -1 },
      create: {
        username,
        password: hash,
        role,
      },
      update: {
        username,
        password: hash,
        role,
        modified: new Date(),
        deleted: false,
      },
    });
  }

  async upsertInitialUser({
    username,
    password,
    role,
  }: CreateUserDTO): Promise<User> {
    const saltOrRounds = this.config.get('SALT_OR_ROUNDS');
    const hash = await Security.createPasswordHash(password, saltOrRounds);
    return await this.prismaService.client.user.upsert({
      where: { username },
      update: {
        modified: new Date(),
      },
      create: {
        username,
        password: hash,
        role,
      },
    });
  }

  async findUser(username: string): Promise<User | null> {
    return await this.prismaService.client.user.findFirst({
      where: {
        username,
        deleted: false,
      },
    });
  }

  async listUsers(): Promise<Partial<User>[]> {
    return await this.prismaService.client.user.findMany({
      where: { deleted: false },
    });
  }

  async deleteUser(username: string): Promise<User> {
    return await this.prismaService.client.user.update({
      where: { username },
      data: {
        deleted: true,
      },
    });
  }
}
