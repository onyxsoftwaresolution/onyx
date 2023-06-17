import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { Client } from '@prisma/client';
import { Expose } from 'class-transformer';

export class ClientOutDTO extends EntityOutDTO implements Client {
  @Expose()
  id: number;

  created: Date;
  modified: Date;
  deleted: boolean;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  cif: string;

  @Expose()
  rc: string;

  @Expose()
  bankName: string;

  @Expose()
  bankIban: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  email: string;
}
