import { PickType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateReceiptInDTO implements Prisma.ReceiptCreateInput {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  created?: string | Date;
  modified?: string | Date;
  deleted?: boolean;

  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsString()
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
  'invoiceNumber',
  'amount',
  'date',
  'type',
] as const) { }

export class UpdateReceiptDTO extends PickType(CreateReceiptInDTO, [
  'id',
  'invoiceNumber',
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
