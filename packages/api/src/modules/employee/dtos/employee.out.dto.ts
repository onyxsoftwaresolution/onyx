import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { Employee } from '@prisma/client';
import { Expose } from 'class-transformer';

export class EmployeeOutDTO extends EntityOutDTO implements Employee {
  @Expose()
  id: number;
  @Expose()
  created: Date;
  @Expose()
  modified: Date;
  @Expose()
  deleted: boolean;
  @Expose()
  name: string;
  @Expose()
  position: string;
  @Expose()
  available: boolean;
}
