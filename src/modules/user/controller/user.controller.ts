import { Roles } from '@modules/auth/rbac/role.decorator';
import { JwtUserDTO } from '@modules/user/dtos/jwt.user.dto';
import { JwtUser } from '@modules/user/user.decorator';
import { UserService } from '@modules/user/service/user.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { CreateUserDTO } from '../dtos/user.create.dto';
import { UserOutDTO } from '../dtos/user-out.dto';

@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Get('self')
  @Roles(Role.ADMIN, Role.USER)
  getSelf(@JwtUser() user: JwtUserDTO): JwtUserDTO {
    return new JwtUserDTO(user);
  }

  @Post()
  @Roles(Role.ADMIN)
  async postUser(
    @Body()
    body: CreateUserDTO,
  ): Promise<UserOutDTO> {
    return await this.userService.createUser(body);
  }

  @Get()
  @Roles(Role.ADMIN)
  async listUsers(): Promise<Partial<User>[]> {
    return await this.userService.listUsers();
  }
}
