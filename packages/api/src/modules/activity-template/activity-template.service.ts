import { Injectable } from '@nestjs/common';
import {
  UpsertActivityTemplateDTO,
} from './dtos/activity-template-in.dto';
import { ActivityTemplateOutDTO } from './dtos/activity-template-out.dto';
import { ActivityTemplateProvider } from './activity-template.provider';

@Injectable()
export class ActivityTemplateService {
  constructor(private activityTemplateProvider: ActivityTemplateProvider) { }

  async listActivityTemplates() {
    const activityTemplates = await this.activityTemplateProvider.listActivityTemplates();
    return activityTemplates.map((e) => new ActivityTemplateOutDTO(e));
  }

  async getActivityTemplate(id: number): Promise<ActivityTemplateOutDTO> {
    return new ActivityTemplateOutDTO(await this.activityTemplateProvider.getActivityTemplate(id));
  }

  async upsertActivityTemplate(data: UpsertActivityTemplateDTO) {
    return new ActivityTemplateOutDTO(await this.activityTemplateProvider.upsertActivityTemplate(data));
  }

  async deleteActivityTemplate(id: number) {
    return new ActivityTemplateOutDTO(await this.activityTemplateProvider.deleteActivityTemplate(id));
  }
}
