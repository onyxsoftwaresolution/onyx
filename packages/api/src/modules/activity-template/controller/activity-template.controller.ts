import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Get, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertActivityTemplateDTO } from '../dtos/activity-template-in.dto';
import { ActivityTemplateOutDTO } from '../dtos/activity-template-out.dto';
import { ActivityTemplateService } from '../service/activity-template.service';

@Controller({
  version: '1',
  path: 'activity-template',
})
export class ActivityTemplateController {
  constructor(private activityService: ActivityTemplateService) {}

  @Get()
  @Roles(Role.ADMIN)
  async listActivities(): Promise<ActivityTemplateOutDTO[]> {
    return await this.activityService.listActivityTemplates();
  }

  @Put()
  @Roles(Role.ADMIN)
  async createActivity(
    @Body() activity: UpsertActivityTemplateDTO,
  ): Promise<ActivityTemplateOutDTO> {
    return await this.activityService.createActivityTemplate(activity);
  }
}
