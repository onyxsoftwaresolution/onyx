import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '@modules/auth/passport/local-auth.guard';
import { AuthService } from '@modules/auth/service/auth.service';
import { AllowAnonymous } from '@modules/auth/rbac/anonymous.decorator';
import { LoginTokenDTO } from '../dtos/login.token.dto';
import { JwtUserDTO } from '@modules/user/dtos/jwt.user.dto';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @AllowAnonymous()
  @Post('login')
  async login(@Request() req: Express.Request): Promise<LoginTokenDTO> {
    return this.authService.createJWT(req.user as JwtUserDTO);
  }
}
