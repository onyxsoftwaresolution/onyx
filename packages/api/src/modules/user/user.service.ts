import { BadRequestException, Injectable } from '@nestjs/common';
import { UserOutDTO } from './dtos/user-out.dto';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from './dtos/user.create.dto';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) { }

  async upsertUser(body: CreateUserDTO): Promise<UserOutDTO> {
    if (body.password !== body.confirmPassword)
      throw new BadRequestException("Passwords do not match!");
    const dbUser = await this.usersRepository.upsertUser(body);
    return new UserOutDTO(dbUser);
  }

  async getUser(username: string): Promise<UserOutDTO> {
    const dbUser = await this.usersRepository.findUser(username);
    return new UserOutDTO(dbUser);
  }

  async upsertInitialUser(body: CreateUserDTO): Promise<UserOutDTO> {
    const dbUser = await this.usersRepository.upsertInitialUser(body);
    return new UserOutDTO(dbUser);
  }

  async listUsers(): Promise<UserOutDTO[]> {
    const dbUsers = await this.usersRepository.listUsers();
    return dbUsers.map((user) => new UserOutDTO(user));
  }

  async deleteUser(username: string): Promise<UserOutDTO> {
    const dbUser = await this.usersRepository.deleteUser(username);
    return new UserOutDTO(dbUser);
  }
}
