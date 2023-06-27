import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginTokenDTO } from './dtos/login.token.dto';
import { UserRepository } from '@modules/user/user.repository';
import { JwtUserDTO } from '@modules/user/dtos/jwt.user.dto';
import { User } from '@prisma/client';
import { Security } from '@common/security/Secutity';
import { ConfigService } from '@common/config/config.service';
import { GoogleApiService } from '@common/googleapi/googleapi.service';
import { Response as ExpressResponse } from "express";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private config: ConfigService,
    private gapi: GoogleApiService,
  ) { }

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

  async getGoogleTokens(res: ExpressResponse) {
    const url = this.gapi.getRedirectUrl();
    res.redirect(url);
  }

  async getGoogleHandler(code: string) {
    const token = await this.gapi.getToken(code);
    return token.tokens;
  }
}
