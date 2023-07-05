import { CreateSupplierDTO } from '@modules/supplier/dtos/supplier.in.dto';
import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

class CreateCostInDTO {
  @IsInt()
  @IsNotEmpty()
  id: number;

  created?: string | Date;
  modified?: string | Date;
  deleted?: boolean;

  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  date: string | Date;

  @IsString()
  @IsNotEmpty()
  details: string;

  @IsInt()
  @IsNotEmpty()
  supplierId: number;

  @Type(() => CreateSupplierDTO)
  supplier: CreateSupplierDTO;
}

export class CreateCostDTO extends PickType(CreateCostInDTO, [
  'invoiceNumber',
  'amount',
  'date',
  'details',
  'supplier'
] as const) { }

export class UpdateCostDTO extends PickType(CreateCostInDTO, [
  'invoiceNumber',
  'amount',
  'date',
  'details',
] as const) { }

export class UpsertCostDTO extends CreateCostDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

export class UpsertCostByIdDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}
