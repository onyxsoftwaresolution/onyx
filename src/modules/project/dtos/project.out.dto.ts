import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { Project } from '@prisma/client';
import { Expose } from 'class-transformer';

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
  localAdminId: number;

  @Expose()
  start: Date;

  @Expose()
  end: Date;

  @Expose()
  available: boolean;
}
