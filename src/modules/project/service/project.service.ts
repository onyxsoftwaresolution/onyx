import { Injectable } from '@nestjs/common';
import { CreateProject } from '../dtos/project.in.dto';
import { ProjectOutDTO } from '../dtos/project.out.dto';
import { ProjectProvider } from '../provider/project.provider';

@Injectable()
export class ProjectService {
  constructor(private projectProvider: ProjectProvider) {}

  async listProjects(): Promise<ProjectOutDTO[]> {
    const projects = await this.projectProvider.listProjects();
    return projects.map((proj) => new ProjectOutDTO(proj));
  }

  async getProject(id: number): Promise<ProjectOutDTO> {
    return new ProjectOutDTO(await this.projectProvider.getProject(id));
  }

  async createProject(createProject: CreateProject): Promise<ProjectOutDTO> {
    return new ProjectOutDTO(
      await this.projectProvider.createProject(createProject),
    );
  }
}
