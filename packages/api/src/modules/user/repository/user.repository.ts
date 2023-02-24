import { ConfigService } from '@common/config/config.service';
import { Security } from '@common/security/Secutity';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { CreateUserDTO } from '../dtos/user.create.dto';

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,
    private config: ConfigService,
  ) {}

  async createUser({ username, password, role }: CreateUserDTO): Promise<User> {
    const saltOrRounds = this.config.get('SALT_OR_ROUNDS');
    const hash = await Security.createPasswordHash(password, saltOrRounds);
    return await this.prismaService.client.user.create({
      data: {
        username,
        password: hash,
        role,
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
      },
    });
  }

  async listUsers(): Promise<Partial<User>[]> {
    return await this.prismaService.client.user.findMany({
      where: { deleted: { equals: false } },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
  }

  async updateUser(
    username: string,
    user: Prisma.UserUpdateInput,
  ): Promise<User> {
    return await this.prismaService.client.user.update({
      data: user,
      where: { username },
    });
  }

  // async deleteUser(username: string): Promise<User> {
  //   return await this.prismaService.client.user.delete({
  //     where: { username },
  //   });
  // }

  async softDeleteUser(username: string): Promise<User> {
    return await this.prismaService.client.user.update({
      where: { username },
      data: {
        deleted: true,
      },
    });
  }
}
