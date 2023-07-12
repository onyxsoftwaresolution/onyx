import { Injectable } from '@nestjs/common';
import { UpsertProjectDTO } from './dtos/project.in.dto';
import { ProjectActivityOutDTO, ProjectQueryParams, ProjectOutDTO, ProjectActivityQueryParams } from './dtos/project.out.dto';
import { ProjectProvider } from './project.provider';
import { QueryPaths } from '@common/QueryParams';

@Injectable()
export class ProjectService {
  constructor(private projectProvider: ProjectProvider) { }

  async listProjects(params: ProjectQueryParams): Promise<ProjectOutDTO[]> {
    const projects = await this.projectProvider.listProjects(params);
    return projects.map((proj) => new ProjectOutDTO(proj));
  }

  async listProjectActivities(projectId: number, params: ProjectActivityQueryParams): Promise<ProjectActivityOutDTO[]> {
    const projects = await this.projectProvider.listProjectActivities(projectId, params);
    return projects.map((proj) => new ProjectActivityOutDTO(proj));
  }

  async getProject(id: number, paths?: QueryPaths): Promise<ProjectOutDTO> {
    return new ProjectOutDTO(await this.projectProvider.getProject(id, paths));
  }

  async upsertProject(data: UpsertProjectDTO): Promise<ProjectOutDTO> {
    return new ProjectOutDTO(await this.projectProvider.upsertProject(data));
  }

  async deleteProject(id: number) {
    return new ProjectOutDTO(await this.projectProvider.deleteProject(id));
  }
}
