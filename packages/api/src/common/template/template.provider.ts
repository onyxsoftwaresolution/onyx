import { ConfigService } from "@common/config/config.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TemplateProvider {
  constructor(
    private config: ConfigService,
  ) {
  }
}
