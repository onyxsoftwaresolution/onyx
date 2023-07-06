import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { IsNonPrimitiveArray } from '@common/validator/IsNonPrimitiveArray';
import { SupplierOutDTO } from '@modules/supplier/dtos/supplier.out.dto';
import { Product } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class ProductOutDTO extends EntityOutDTO implements Product {
  @Expose()
  id: number;

  created: Date;
  modified: Date;
  deleted: boolean;

  @Expose()
  name: string;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => SupplierOutDTO)
  suppliers: SupplierOutDTO[];
}
