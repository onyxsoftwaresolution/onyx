import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertActivityTemplateDTO } from '../dtos/activity-template-in.dto';
import { ActivityTemplateOutDTO } from '../dtos/activity-template-out.dto';
import { ActivityTemplateService } from '../service/activity-template.service';

@Controller({
  version: '1',
  path: '',
})
export class ActivityTemplateController {
  constructor(private activityService: ActivityTemplateService) { }

  @Get('activity-templates')
  @Roles(Role.ADMIN, Role.USER)
  async listActivities(): Promise<ActivityTemplateOutDTO[]> {
    return await this.activityService.listActivityTemplates();
  }

  @Put('activity-template')
  @Roles(Role.ADMIN, Role.USER)
  async upsertActivity(
    @Body() activity: UpsertActivityTemplateDTO,
  ): Promise<ActivityTemplateOutDTO> {
    return await this.activityService.upsertActivityTemplate(activity);
  }

  @Delete('activity-template/:id')
  @Roles(Role.ADMIN, Role.USER)
  async deleteActivity(
    @Param('id') id: number,
  ): Promise<ActivityTemplateOutDTO> {
    return await this.activityService.deleteActivityTemplate(id);
  }
}
