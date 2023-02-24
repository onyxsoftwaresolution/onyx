import { Injectable } from '@nestjs/common';
import { UserOutDTO } from '../dtos/user-out.dto';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDTO } from '../dtos/user.create.dto';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  async createUser(body: CreateUserDTO): Promise<UserOutDTO> {
    const dbUser = await this.usersRepository.createUser(body);
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
}
