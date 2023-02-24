import { Roles } from '@modules/auth/rbac/role.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ProjectService } from '../service/project.service';

@Controller({
  version: '1',
  path: 'project',
})
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  async listProjects() {
    return await this.projectService.listProjects();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  async getProject(@Param('id') id: number) {
    return await this.projectService.getProject(id);
  }
}
