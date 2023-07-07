import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertActivityTemplateDTO } from './dtos/activity-template-in.dto';
import { ActivityTemplateService } from './activity-template.service';

@Controller({
  version: '1',
  path: '',
})
export class ActivityTemplateController {
  constructor(private activityService: ActivityTemplateService) { }

  @Get('activity-template/:id')
  @Roles(Role.ADMIN)
  async getActivityTemplate(@Param('id') id: number) {
    return await this.activityService.getActivityTemplate(id);
  }

  @Get('activity-templates')
  @Roles(Role.ADMIN, Role.USER)
  async listActivityTemplates() {
    return await this.activityService.listActivityTemplates();
  }

  @Put('activity-template')
  @Roles(Role.ADMIN)
  async upsertActivityTemplate(@Body() data: UpsertActivityTemplateDTO) {
    return await this.activityService.upsertActivityTemplate(data);
  }

  @Delete('activity-template/:id')
  @Roles(Role.ADMIN)
  async deleteActivityTemplate(@Param('id') id: number) {
    return await this.activityService.deleteActivityTemplate(id);
  }
}
