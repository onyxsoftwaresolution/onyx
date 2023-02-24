import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { ActivityTemplate } from '@prisma/client';
import { Expose } from 'class-transformer';

export class ActivityTemplateOutDTO
  extends EntityOutDTO
  implements ActivityTemplate
{
  @Expose()
  id: number;
  @Expose()
  description: string;
  @Expose()
  material: string;
  @Expose()
  cost: number;
  @Expose()
  available: boolean;
  @Expose()
  created: Date;
  @Expose()
  modified: Date;

  deleted: boolean;
}
