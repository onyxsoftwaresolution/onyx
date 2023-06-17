import { ConfigService } from '@common/config/config.service';
import { Injectable } from '@nestjs/common';
import { InfoDTO } from './dtos/info.dto';
import { AppProvider } from './app.provider';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private appProvider: AppProvider,
  ) { }

  pong(): string {
    return 'pong';
  }

  info() {
    return new InfoDTO({
      NODE_ENV: this.configService.get('NODE_ENV'),
      corsOrigin: this.configService.get('APP_URL_REGEX'),
    });
  }

  async keepAlive() {
    await this.appProvider.keepAlive();
  }
}
