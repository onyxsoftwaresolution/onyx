import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { ContractOutDTO } from '@modules/contract/dtos/contract.out.dto';
import { Receipt } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

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

  @Expose()
  contractId: number;

  @Expose()
  @Type(() => ContractOutDTO)
  contract: ContractOutDTO;
}
