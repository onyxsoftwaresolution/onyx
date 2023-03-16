import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { Employee } from '@prisma/client';
import { Expose } from 'class-transformer';

export class EmployeeOutDTO extends EntityOutDTO implements Employee {
  @Expose()
  id: number;
  created: Date;
  modified: Date;
  deleted: boolean;
  @Expose()
  name: string;
  @Expose()
  position: string;
  available: boolean;
}
