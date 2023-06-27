import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { ClientOutDTO } from '@modules/client/dtos/client.out.dto';
import { Contract } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

export class ContractOutDTO extends EntityOutDTO implements Contract {
  @Expose()
  id: number;

  created: Date;
  modified: Date;
  deleted: boolean;

  @Expose()
  number: string;

  @Expose()
  cost: number;

  @Expose()
  start: Date;

  @Expose()
  end: Date;

  @Expose()
  location: string;

  @Expose()
  details: string;

  @Expose()
  clientId: number;

  @Expose()
  @Type(() => ClientOutDTO)
  client: ClientOutDTO;

  @Expose()
  representative: string;
}
