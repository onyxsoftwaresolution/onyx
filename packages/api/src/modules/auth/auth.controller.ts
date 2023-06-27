import { Controller, Get, Header, Post, Query, Request, Response, SerializeOptions, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '@modules/auth/passport/local-auth.guard';
import { AuthService } from '@modules/auth/auth.service';
import { AllowAnonymous } from '@modules/auth/rbac/anonymous.decorator';
import { LoginTokenDTO } from './dtos/login.token.dto';
import { JwtUserDTO } from '@modules/user/dtos/jwt.user.dto';
import { Response as ExpressResponse } from "express";

@Controller({
  version: '1',
  path: '',
})
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @AllowAnonymous()
  @Post('auth/login')
  async login(@Request() req: Express.Request): Promise<LoginTokenDTO> {
    return this.authService.createJWT(req.user as JwtUserDTO);
  }

  @AllowAnonymous()
  @Get('auth/google')
  async google(
    @Response() res: ExpressResponse,
  ) {
    return this.authService.getGoogleTokens(res);
  }

  @SerializeOptions({
    strategy: 'exposeAll'
  })
  @AllowAnonymous()
  @Get('auth/handler')
  @Header('content-type', 'application/json')
  async handler(
    @Query('code') code: string,
  ) {
    return this.authService.getGoogleHandler(code);
  }
}
