import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { IsNonPrimitiveArray } from '@common/validator/IsNonPrimitiveArray';
import { ProjectOutDTO } from '@modules/project/dtos/project.out.dto';
import { Receipt } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class ReceiptOutDTO extends EntityOutDTO implements Receipt {
  @Expose()
  id: number;

  created: Date;
  modified: Date;
  deleted: boolean;

  @Expose()
  invoiceNumber: string;

  @Expose()
  amount: number;

  @Expose()
  date: Date;

  @Expose()
  type: string;
}