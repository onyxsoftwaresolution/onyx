import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { InvoiceOutDTO } from '@modules/invoice/dtos/invoice.out.dto';
import { Receipt } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

export class ReceiptOutDTO extends EntityOutDTO implements Receipt {
  @Expose()
  id: number;

  created: Date;
  modified: Date;
  deleted: boolean;

  @Expose()
  invoiceId: number;

  @Expose()
  @Type(() => InvoiceOutDTO)
  invoice: InvoiceOutDTO;

  @Expose()
  amount: number;

  @Expose()
  date: Date;

  @Expose()
  type: string;
}
