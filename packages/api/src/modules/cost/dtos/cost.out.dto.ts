import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { ProjectActivityOutDTO } from '@modules/project/dtos/project.out.dto';
import { Cost } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

export class CostOutDTO extends EntityOutDTO implements Cost {
  @Expose()
  id: number;

  created: Date;
  modified: Date;
  deleted: boolean;

  @Expose()
  projectActivityId: number;

  @Expose()
  @Type(() => ProjectActivityOutDTO)
  projectActivity: ProjectActivityOutDTO;

  @Expose()
  invoiceNumber: string;

  @Expose()
  amount: number;

  @Expose()
  date: Date;

  @Expose()
  details: string;
}
