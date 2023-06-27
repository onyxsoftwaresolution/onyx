import { Injectable } from '@nestjs/common';
import { UpsertProjectDTO } from './dtos/project.in.dto';
import { ProjectOutDTO } from './dtos/project.out.dto';
import { ProjectProvider } from './project.provider';

@Injectable()
export class ProjectService {
  constructor(private projectProvider: ProjectProvider) { }

  async listProjects(): Promise<ProjectOutDTO[]> {
    const projects = await this.projectProvider.listProjects();
    return projects.map((proj) => new ProjectOutDTO(proj));
  }

  async getProject(id: number): Promise<ProjectOutDTO> {
    return new ProjectOutDTO(await this.projectProvider.getProject(id));
  }

  async upsertProject(data: UpsertProjectDTO): Promise<ProjectOutDTO> {
    return new ProjectOutDTO(await this.projectProvider.upsertProject(data));
  }

  async deleteProject(id: number) {
    return new ProjectOutDTO(await this.projectProvider.deleteProject(id));
  }
}
