import { Roles } from '@modules/auth/rbac/role.decorator';
import { Controller, Delete, Get, Param } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ProjectService } from '../service/project.service';

@Controller({
  version: '1',
  path: '',
})
export class ProjectController {
  constructor(private projectService: ProjectService) {}

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

  @Delete('project/:id')
  @Roles(Role.ADMIN, Role.USER)
  async deleteProject(@Param('id') id: number) {
    return await this.projectService.deleteProject(id);
  }
}
