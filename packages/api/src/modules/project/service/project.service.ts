import { EmployeeOutDTO } from '@modules/employee/dtos/employee.out.dto';
import { Injectable } from '@nestjs/common';
import { UpsertProjectDTO } from '../dtos/project.in.dto';
import { ProjectActivityOutDTO, ProjectOutDTO } from '../dtos/project.out.dto';
import { ProjectProvider } from '../provider/project.provider';

@Injectable()
export class ProjectService {
  constructor(private projectProvider: ProjectProvider) { }

  async listProjects(): Promise<ProjectOutDTO[]> {
    const projects = await this.projectProvider.listProjects();
    return projects.map((proj) => new ProjectOutDTO(proj));
  }

  async getProject(id: number): Promise<ProjectOutDTO> {
    const project = await this.projectProvider.getProject(id);
    project.localAdmin = new EmployeeOutDTO(project.localAdmin);
    project.areaAdmin = new EmployeeOutDTO(project.areaAdmin);
    project.projectActivities = project.projectActivities.map(pa => new ProjectActivityOutDTO(pa))
    return new ProjectOutDTO(project);
  }

  async upsertProject(data: UpsertProjectDTO): Promise<ProjectOutDTO> {
    return new ProjectOutDTO(await this.projectProvider.upsertProject(data));
  }

  async deleteProject(id: number) {
    return new ProjectOutDTO(await this.projectProvider.deleteProject(id));
  }
}
