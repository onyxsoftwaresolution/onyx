import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AllowAnonymous } from '@modules/auth/rbac/anonymous.decorator';

@Controller({
  version: '1',
  path: '',
})
export class AppController {
  constructor(
    private appService: AppService,
  ) { }

  @Get('ping')
  ping(): string {
    return this.appService.pong();
  }

  @Get('info')
  info() {
    return this.appService.info();
  }

  @Get('keep-alive')
  @AllowAnonymous()
  async keepAlive() {
    await this.appService.keepAlive();
    return ({
      ok: true,
    });
  }
}
