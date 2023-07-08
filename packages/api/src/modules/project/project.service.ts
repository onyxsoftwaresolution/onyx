import { Injectable } from '@nestjs/common';
import { UpsertProjectDTO } from './dtos/project.in.dto';
import { ProjectActivityOutDTO, ProjectOutDTO } from './dtos/project.out.dto';
import { ProjectProvider } from './project.provider';
import { CostOutDTO } from '@modules/cost/dtos/cost.out.dto';

@Injectable()
export class ProjectService {
  constructor(private projectProvider: ProjectProvider) { }

  async listProjects(): Promise<ProjectOutDTO[]> {
    const projects = await this.projectProvider.listProjects();
    return projects.map((proj) => new ProjectOutDTO(proj));
  }

  async listProjectActivities(projectId: number): Promise<ProjectActivityOutDTO[]> {
    const projects = await this.projectProvider.listProjectActivities(projectId);
    return projects.map((proj) => new ProjectActivityOutDTO(proj));
  }

  async listProjectActivityCosts(activityId: number): Promise<CostOutDTO[]> {
    const costs = await this.projectProvider.listProjectActivityCosts(activityId);
    return costs.map((activity) => new CostOutDTO(activity));
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
