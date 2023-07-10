import { UpsertInvoiceDTO } from '@modules/invoice/dtos/invoice.in.dto';
import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

class CreateReceiptInDTO {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  created?: string | Date;
  modified?: string | Date;
  deleted?: boolean;

  @IsInt()
  @IsNotEmpty()
  invoiceId: number;

  @IsNotEmpty()
  @Type(() => UpsertInvoiceDTO)
  invoice: UpsertInvoiceDTO;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  date: string | Date;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class CreateReceiptDTO extends PickType(CreateReceiptInDTO, [
  'invoice',
  'amount',
  'date',
  'type',
] as const) { }

export class UpdateReceiptDTO extends PickType(CreateReceiptInDTO, [
  'id',
  'invoice',
  'amount',
  'date',
  'type',
] as const) { }

export class UpsertReceiptDTO extends CreateReceiptDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

export class UpsertReceiptByIdDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}
