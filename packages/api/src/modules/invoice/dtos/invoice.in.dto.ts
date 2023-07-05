import { PickType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateInvoiceInDTO {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  number: string;
}

export class CreateInvoiceDTO extends PickType(CreateInvoiceInDTO, [
  'number',
] as const) { }

export class UpdateInvoiceDTO extends PickType(CreateInvoiceInDTO, [
  'id',
  'number',
] as const) { }

export class UpsertInvoiceDTO extends CreateInvoiceDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}

export class UpsertInvoiceByIdDTO {
  @IsInt()
  @IsOptional()
  id?: number;
}
