import { ConfigService } from '@common/config/config.service';
import { Injectable } from '@nestjs/common';
import { InfoDTO } from './dtos/info.dto';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
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
}
