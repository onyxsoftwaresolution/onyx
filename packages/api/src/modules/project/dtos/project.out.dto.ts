import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { EmployeeOutDTO } from '@modules/employee/dtos/employee.out.dto';
import { Project, ProjectActivity } from '@prisma/client';
import { Expose } from 'class-transformer';

export class ProjectActivityOutDTO extends EntityOutDTO implements ProjectActivity {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  description: string;

  @Expose()
  material: string;

  @Expose()
  cost: number;

  created: Date;
  modified: Date;
  deleted: boolean;
  projectId: number;
}

export class ProjectOutDTO extends EntityOutDTO implements Project {
  @Expose()
  id: number;

  @Expose()
  created: Date;

  @Expose()
  modified: Date;

  deleted: boolean;

  @Expose()
  code: string;

  @Expose()
  description: string;

  @Expose()
  area: string;

  @Expose()
  areaAdminId: number;

  @Expose()
  areaAdmin: EmployeeOutDTO;

  @Expose()
  localAdminId: number;

  @Expose()
  localAdmin: EmployeeOutDTO;

  @Expose()
  start: Date;

  @Expose()
  end: Date;

  @Expose()
  available: boolean;

  @Expose()
  projectActivities: ProjectActivityOutDTO[];
}
