import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

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
}
