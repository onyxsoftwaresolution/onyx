import { Injectable } from '@nestjs/common';
import {
  CreateActivityTemplateDTO,
  UpsertActivityTemplateDTO,
} from '../dtos/activity-template-in.dto';
import { ActivityTemplateOutDTO } from '../dtos/activity-template-out.dto';
import { ActivityTemplateProvider } from '../provider/activity-template.provider';

@Injectable()
export class ActivityTemplateService {
  constructor(private activityTemplateProvider: ActivityTemplateProvider) {}

  async createActivityTemplate(activity: CreateActivityTemplateDTO) {
    return new ActivityTemplateOutDTO(
      await this.activityTemplateProvider.createActivityTemplates(activity),
    );
  }

  async upsertActivityTemplate(activity: UpsertActivityTemplateDTO) {
    return new ActivityTemplateOutDTO(
      await this.activityTemplateProvider.upsertActivityTemplates(activity),
    );
  }

  async listActivityTemplates() {
    const activityTemplates =
      await this.activityTemplateProvider.listActivityTemplates();

    return activityTemplates.map(
      (template) => new ActivityTemplateOutDTO(template),
    );
  }
}
