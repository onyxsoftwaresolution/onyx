import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { Supplier } from '@prisma/client';
import { Expose } from 'class-transformer';

export class SupplierOutDTO extends EntityOutDTO implements Supplier {
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

  @Expose()
  products: string;
}
