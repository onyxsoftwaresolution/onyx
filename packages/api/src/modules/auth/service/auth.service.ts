import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginTokenDTO } from '../dtos/login.token.dto';
import { UserRepository } from '@modules/user/repository/user.repository';
import { JwtUserDTO } from '@modules/user/dtos/jwt.user.dto';
import { User } from '@prisma/client';
import { Security } from '@common/security/Secutity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.userRepository.findUser(username);
    if (user == null) return null;
    const { password, ...result } = user;
    const success = await Security.comparePasswordHash(pass, password);
    if (success) {
      return result as User;
    }
    return null;
  }

  async createJWT(user: JwtUserDTO): Promise<LoginTokenDTO> {
    return new LoginTokenDTO({
      user: new JwtUserDTO(user),
      access_token: this.jwtService.sign({
        id: user.id,
        username: user.username,
        role: user.role,
      }),
    });
  }
}
