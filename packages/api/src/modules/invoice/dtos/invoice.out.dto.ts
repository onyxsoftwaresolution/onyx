import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { Expose } from 'class-transformer';

export class InvoiceOutDTO extends EntityOutDTO {
  @Expose()
  id: number;

  // created: Date;
  // modified: Date;
  // deleted: boolean;

  @Expose()
  number: string;
}
