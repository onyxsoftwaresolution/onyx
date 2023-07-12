import { EntityOutDTO } from '@common/dtos/entity.out.dto';
import { IsNonPrimitiveArray } from '@common/validator/IsNonPrimitiveArray';
import { ProjectOutDTO } from '@modules/project/dtos/project.out.dto';
import { ReceiptOutDTO } from '@modules/receipt/dtos/receipt.out.dto';
import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class InvoiceOutDTO extends EntityOutDTO {
  @Expose()
  id: number;

  created: Date;
  modified: Date;
  deleted: boolean;

  @Expose()
  number: string;

  @Expose()
  issueDate: Date;

  @Expose()
  dueDate: Date;

  @Expose()
  projectId: number;

  @Expose()
  @Type(() => ProjectOutDTO)
  project: ProjectOutDTO;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @IsNonPrimitiveArray()
  @Type(() => ReceiptOutDTO)
  receipts: ReceiptOutDTO[];
}

export class InvoiceDownloadUrl extends EntityOutDTO {
  @Expose()
  invoiceNumber: string;

  @Expose()
  url: string;
}
