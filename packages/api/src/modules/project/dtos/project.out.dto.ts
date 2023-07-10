import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { IsNonPrimitiveArray } from '@common/validator/IsNonPrimitiveArray';
import { ActivityTemplateOutDTO } from '@modules/activity-template/dtos/activity-template-out.dto';
import { ContractOutDTO } from '@modules/contract/dtos/contract.out.dto';
import { CostOutDTO } from '@modules/cost/dtos/cost.out.dto';
import { EmployeeOutDTO } from '@modules/employee/dtos/employee.out.dto';
import { Project, ProjectActivity } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

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
  @Type(() => EmployeeOutDTO)
  areaAdmin: EmployeeOutDTO;

  @Expose()
  localAdminId: number;

  @Expose()
  @Type(() => EmployeeOutDTO)
  localAdmin: EmployeeOutDTO;

  @Expose()
  start: Date;

  @Expose()
  end: Date;

  @Expose()
  available: boolean;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => ProjectActivityOutDTO)
  projectActivities: ProjectActivityOutDTO[];

  @Expose()
  contractId: number;

  @Expose()
  @Type(() => ContractOutDTO)
  contract: ContractOutDTO;
}

export class ProjectActivityOutDTO extends EntityOutDTO implements ProjectActivity {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  description: string;

  @Expose()
  cost: number;

  created: Date;
  modified: Date;
  deleted: boolean;

  @Expose()
  projectId: number;

  @Expose()
  @Type(() => ProjectOutDTO)
  project: ProjectOutDTO;

  @Expose()
  activityTemplateId: number;

  @Expose()
  @Type(() => ActivityTemplateOutDTO)
  activityTemplate: ActivityTemplateOutDTO;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => CostOutDTO)
  costs: CostOutDTO[];
}

export class ProjectQueryParams {
  'available'?: boolean = true;
  'contract'?: boolean;
  'projectActivities'?: boolean;
  'projectActivities.activityTemplate'?: boolean;
  'areaAdmin'?: boolean;
  'localAdmin'?: boolean;
}

export class ProjectActivityQueryParams {
  'project'?: boolean;
  'project.available'?: boolean | null = true;
  'project.contract'?: boolean;
  'project.projectActivities'?: boolean;
  'project.areaAdmin'?: boolean;
  'project.localAdmin'?: boolean;
  'activityTemplate'?: boolean;
  'activityTemplate.supplier'?: boolean
  'activityTemplate.product'?: boolean
  'costs'?: boolean;
}
