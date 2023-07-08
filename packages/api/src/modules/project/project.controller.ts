import { Roles } from '@modules/auth/rbac/role.decorator';
import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpsertProjectDTO } from './dtos/project.in.dto';
import { ProjectService } from './project.service';

@Controller({
  version: '1',
  path: '',
})
export class ProjectController {
  constructor(private projectService: ProjectService) { }

  @Get('project/:id/project-activities')
  @Roles(Role.ADMIN, Role.USER)
  async listProjectActivities(@Param('id') id: number) {
    return await this.projectService.listProjectActivities(id);
  }

  @Get('project-activity/:id/costs')
  @Roles(Role.ADMIN, Role.USER)
  async listProjectActivityCosts(@Param('id') id: number) {
    return await this.projectService.listProjectActivityCosts(id);
  }

  @Get('projects')
  @Roles(Role.ADMIN, Role.USER)
  async listProjects() {
    return await this.projectService.listProjects();
  }

  @Get('project/:id')
  @Roles(Role.ADMIN, Role.USER)
  async getProject(@Param('id') id: number) {
    return await this.projectService.getProject(id);
  }

  @Put('project')
  @Roles(Role.ADMIN)
  async upsertProject(@Body() data: UpsertProjectDTO) {
    return await this.projectService.upsertProject(data);
  }

  @Delete('project/:id')
  @Roles(Role.ADMIN)
  async deleteProject(@Param('id') id: number) {
    return await this.projectService.deleteProject(id);
  }
}
