import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { ProductOutDTO } from '@modules/product/dtos/product.out.dto';
import { SupplierOutDTO } from '@modules/supplier/dtos/supplier.out.dto';
import { ActivityTemplate } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

export class ActivityTemplateOutDTO extends EntityOutDTO implements ActivityTemplate {
  @Expose()
  id: number;
  @Expose()
  description: string;
  @Expose()
  cost: number;
  @Expose()
  available: boolean;
  @Expose()
  created: Date;
  @Expose()
  modified: Date;

  deleted: boolean;

  @Expose()
  supplierId: number;

  @Expose()
  @Type(() => SupplierOutDTO)
  supplier: SupplierOutDTO;

  @Expose()
  productId: number;

  @Expose()
  @Type(() => ProductOutDTO)
  product: ProductOutDTO;
}
